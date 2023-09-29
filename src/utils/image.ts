export interface ImageInfo {
  data: string;
  mimeType: string;
}

export const fileToBase64String = (file: Blob): Promise<string> =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = (error) => reject(error);
});

export const urlToBase64String = async (url: string): Promise<string> => {
  const res = await window.fetch(url);
  const blob = await res.blob();
  return fileToBase64String(blob);
}

export const urlToBase64ImageInfo = async (url: string): Promise<ImageInfo> => {
  const res = await window.fetch(url);
  const file = await res.blob();
  const mimeType = file.type;
  return {
    data: await fileToBase64String(file),
    mimeType,
  };
}

export const base64StringToBlob = (base64String: string, mimeType: string): Blob => {
  const byteCharacters = window.atob(base64String.split('base64,')[1]);
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