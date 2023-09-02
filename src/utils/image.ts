export const fileToBase64String = (file: File): Promise<string> =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = (error) => reject(error);
});

export const base64StringToBlob = (base64String: string, mimeType: string): Blob => {
  const byteCharacters = window.atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: mimeType });
}

export const downloadImage = (blob: Blob, fileName?: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = (fileName || `image_${Date.now()}`);
  link.click();
  URL.revokeObjectURL(url);
}