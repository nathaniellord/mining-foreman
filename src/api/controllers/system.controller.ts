export class SystemController {

  public getHeartbeat(req, res) {
    res.json({ 'status': 'active' });
  }

}