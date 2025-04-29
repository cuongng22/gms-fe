export class EstAnnualProduction {
  id: string;
  verType: string;
  network: string;
  route: string;
  routeId: number;
  route2w: string;
  ori: string;
  des: string;
  oriCountry: string;
  desCountry: string;
  verId: number;
  acId: string;
  acGroup: string;
  carrier: string;
  fltDate: string;
  fltMonth: number;
  fltYear: number;
  bh: number;
  fls: number;
  rateBhFls: number;

  constructor(data: {
    id: string;
    verType: string;
    network: string;
    route: string;
    routeId: number;
    route2w: string;
    ori: string;
    des: string;
    oriCountry: string;
    desCountry: string;
    verId: number;
    acId: string;
    acGroup: string;
    carrier: string;
    fltDate: string;
    fltMonth: number;
    fltYear: number;
    bh: number;
    fls: number;
    rateBhFls: number;
  }) {
    this.id = data.id;
    this.verType = data.verType;
    this.network = data.network;
    this.route = data.route;
    this.routeId = data.routeId;
    this.route2w = data.route2w;
    this.ori = data.ori;
    this.des = data.des;
    this.oriCountry = data.oriCountry;
    this.desCountry = data.desCountry;
    this.verId = data.verId;
    this.acId = data.acId;
    this.acGroup = data.acGroup;
    this.carrier = data.carrier;
    this.fltDate = data.fltDate;
    this.fltMonth = data.fltMonth;
    this.fltYear = data.fltYear;
    this.bh = data.bh;
    this.fls = data.fls;
    this.rateBhFls = data.rateBhFls;
  }
}

export const NetWorkOptions = [
  {
    value: 'DOM', display: 'Domestic'
  },
  {
    value: 'INT', display: 'International'
  }
]