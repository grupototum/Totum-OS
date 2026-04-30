import { useEffect, useMemo } from "react";
import { storeGoogleDriveToken } from "@/services/alexandriaKnowledgeSync";

export default function GoogleDriveCallback() {
  const result = useMemo(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const tokenType = hash.get("token_type") || "Bearer";
    const expiresIn = Number(hash.get("expires_in") || "3600");
    const error = hash.get("error");

    return { accessToken, tokenType, expiresIn, error };
  }, []);

  useEffect(() => {
    if (result.accessToken) {
      const payload = {
        accessToken: result.accessToken,
        tokenType: result.tokenType,
        expiresAt: Date.now() + result.expiresIn * 1000,
      };

      storeGoogleDriveToken(payload);
      window.opener?.postMessage({ type: "totum-google-drive-auth", payload }, window.location.origin);
      window.close();
    }
  }, [result]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-semibold text-foreground">Google Drive</h1>
        {result.error ? (
          <p className="text-sm text-destructive">
            Não foi possível concluir a conexão: {result.error}
          </p>
        ) : result.accessToken ? (
          <p className="text-sm text-muted-foreground">
            Conexão concluída. Você já pode voltar para a Alexandria.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aguardando retorno da autenticação do Google Drive.
          </p>
        )}
      </div>
    </div>
  );
}
