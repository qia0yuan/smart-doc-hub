import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  saveDownloadedFile(resp: any, filename: string) {
    const blob = new Blob([resp.body]);
    if (!filename) {
      const headers = resp.headers,
      contentDisposition = headers.get('content-disposition');
      if (contentDisposition) {
        const result = contentDisposition.split(';')[1].trim().split('=')[1];
        filename = result.replace(/"/g, '');
      } else {
        //show error
      }
    } else {
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    //show spinner
  }
}
