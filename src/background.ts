import { HelloService } from './services/hello.service';

export const helloService = new HelloService();

chrome.runtime.onInstalled.addListener(details => {
  console.log('Extension installed!');
  helloService.start();
});
