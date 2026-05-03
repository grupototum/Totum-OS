/** Google Drive API wrapper — uses Google Identity Services (GIS) for auth.
 *  Requires VITE_GOOGLE_DRIVE_CLIENT_ID in .env.local.
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID as string | undefined;
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  parents?: string[];
}

export interface DriveFolder {
  id: string;
  name: string;
}

let _tokenClient: any = null;
let _accessToken: string | null = null;

function loadGIS(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.accounts) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Falha ao carregar Google Identity Services'));
    document.head.appendChild(script);
  });
}

export async function driveLogin(): Promise<string> {
  if (!CLIENT_ID) throw new Error('VITE_GOOGLE_DRIVE_CLIENT_ID não configurado em .env.local');
  await loadGIS();

  return new Promise((resolve, reject) => {
    _tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (resp: any) => {
        if (resp.error) return reject(new Error(resp.error));
        _accessToken = resp.access_token;
        resolve(resp.access_token);
      },
    });
    _tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

export function driveLogout() {
  if (_accessToken && (window as any).google?.accounts?.oauth2) {
    (window as any).google.accounts.oauth2.revoke(_accessToken);
  }
  _accessToken = null;
}

export function isLoggedIn() { return !!_accessToken; }

async function driveGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  if (!_accessToken) throw new Error('Não autenticado no Google Drive');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`https://www.googleapis.com/drive/v3/${path}${qs ? '?' + qs : ''}`, {
    headers: { Authorization: `Bearer ${_accessToken}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Drive API error ${res.status}`);
  }
  return res.json();
}

/** List files in a folder (or root if folderId = 'root'). */
export async function listDriveFiles(folderId = 'root'): Promise<DriveFile[]> {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const data = await driveGet<{ files: DriveFile[] }>('files', {
    q: decodeURIComponent(q),
    fields: 'files(id,name,mimeType,modifiedTime,size,parents)',
    pageSize: '200',
  });
  return data.files || [];
}

/** List only folders in a folder. */
export async function listDriveFolders(folderId = 'root'): Promise<DriveFolder[]> {
  const files = await listDriveFiles(folderId);
  return files
    .filter(f => f.mimeType === 'application/vnd.google-apps.folder')
    .map(f => ({ id: f.id, name: f.name }));
}

/** Export a Google Doc as plain text. */
async function exportGoogleDoc(fileId: string): Promise<string> {
  if (!_accessToken) throw new Error('Não autenticado no Google Drive');
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`,
    { headers: { Authorization: `Bearer ${_accessToken}` } }
  );
  if (!res.ok) throw new Error(`Falha ao exportar Google Doc ${fileId}`);
  return res.text();
}

/** Download a regular file as text. */
async function downloadFile(fileId: string): Promise<string> {
  if (!_accessToken) throw new Error('Não autenticado no Google Drive');
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${_accessToken}` } }
  );
  if (!res.ok) throw new Error(`Falha ao baixar arquivo ${fileId}`);
  return res.text();
}

export interface DriveFileContent {
  id: string;
  name: string;
  content: string;
  mimeType: string;
  modifiedTime: string;
}

/** Fetch content of a Drive file (Google Docs exported as text, or direct download). */
export async function fetchDriveFileContent(file: DriveFile): Promise<DriveFileContent> {
  let content: string;
  if (file.mimeType === 'application/vnd.google-apps.document') {
    content = await exportGoogleDoc(file.id);
  } else if (
    file.mimeType.startsWith('text/') ||
    file.name.endsWith('.md') ||
    file.name.endsWith('.txt')
  ) {
    content = await downloadFile(file.id);
  } else {
    throw new Error(`Tipo não suportado: ${file.mimeType}`);
  }
  return { id: file.id, name: file.name, content, mimeType: file.mimeType, modifiedTime: file.modifiedTime };
}
