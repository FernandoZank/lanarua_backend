export default interface IDiskProvider {
  saveFile(file: string, folder: string): Promise<string>;
  deleteFile(file: string, folder: string): Promise<void>;
}
