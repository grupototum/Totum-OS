type DirectoryPickerOptions = {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: FileList | null) => void;
};

export function openDirectoryPicker({
  accept,
  multiple = true,
  onFiles,
}: DirectoryPickerOptions) {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = multiple;

  if (accept) {
    input.accept = accept;
  }

  // Some browsers only honor directory selection when the DOM property exists
  // before the click, instead of when the attribute is mutated later.
  (input as HTMLInputElement & { webkitdirectory?: boolean; directory?: boolean }).webkitdirectory = true;
  (input as HTMLInputElement & { webkitdirectory?: boolean; directory?: boolean }).directory = true;
  input.setAttribute("webkitdirectory", "");
  input.setAttribute("directory", "");

  input.style.position = "fixed";
  input.style.left = "-9999px";
  input.style.top = "0";

  input.addEventListener(
    "change",
    () => {
      onFiles(input.files);
      input.remove();
    },
    { once: true }
  );

  document.body.appendChild(input);
  input.click();
}
