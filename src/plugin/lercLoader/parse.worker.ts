import { parse } from "./parse";

self.onmessage = (msg: MessageEvent) => {
	const data = msg.data;
	const mesh = parse(data);
	self.postMessage(mesh);
	self.close();
};
