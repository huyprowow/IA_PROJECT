interface ILinkModel {
  IA: string;
  REM: { obj: String; mtl: string };
  PLAYER: {
    model: {
      robot: string;
      girl: string;
    };
    animation: ILinkActionModel;
  };
}
interface ILinkActionModel {
  idle: string;
  baseballWalk: string;
  block: string;
  walk: string;
  injuredWalk: string;
  leftTurn: string;
  martelo2: string;
  mmaKick: string;
  orcIdle: string;
  standIdleToFight: string;
  taunt: string;
  thankfull: string;
}
