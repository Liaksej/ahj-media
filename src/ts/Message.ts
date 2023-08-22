export class Message {
  public date: number;
  constructor(
    public text: string,
    public geo: { lat: number; lng: number },
    public video?: Blob,
    public audio?: Blob,
  ) {
    this.text = text;
    this.geo = geo;
    this.date = Date.now();
    this.video = video;
    this.audio = audio;
  }
}
