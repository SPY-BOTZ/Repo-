import JSZip from 'jszip';
import { BOT_FILES, BotFile } from '../data/botFiles';

export async function generateBotZip(customFiles?: BotFile[]): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('My-auto-bot-arpite-main') || zip;

  const filesToInclude = customFiles || BOT_FILES;

  filesToInclude.forEach((file) => {
    folder.file(file.path, file.content);
  });

  // Generate the zip blob
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9
    }
  });

  return content;
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
