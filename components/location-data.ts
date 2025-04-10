/*  A central place for all pickable locations – ASCII spaces only  */
export interface LocationItem {
    label: string;
    address: string;
  }
  
  export const LOCATIONS: LocationItem[] = [
    /* ——— Yale campus ——— */
    { label: "Yale Old Campus", address: "344 College St, New Haven CT 06511" },
    { label: "Kline Tower (Science Hill)", address: "219 Prospect St, New Haven CT 06511" },
    { label: "Yale Law School", address: "127 Wall St, New Haven CT 06511" },
    { label: "Yale SOM", address: "165 Whitney Ave, New Haven CT 06511" },
    { label: "Yale School of Medicine", address: "333 Cedar St, New Haven CT 06510" },
    { label: "Yale Peabody Museum", address: "170 Whitney Ave, New Haven CT 06511" },
    { label: "Yale University Art Gallery", address: "1111 Chapel St, New Haven CT 06510" },
    { label: "Sterling Memorial Library", address: "120 High St, New Haven CT 06511" },
    { label: "Bass Library", address: "110 Wall St, New Haven CT 06511" },
    { label: "Payne Whitney Gym", address: "70 Tower Pkwy, New Haven CT 06511" },
    { label: "Yale Schwarzman Center", address: "168 Grove St, New Haven CT 06511" },
  
    /* ——— Outdoors / downtown ——— */
    { label: "East Rock Park", address: "41 Cold Spring St, New Haven CT 06511" },
    { label: "New Haven Green", address: "250 Temple St, New Haven CT 06511" },
  
    /* ——— Transportation ——— */
    { label: "Union Station (NHV)", address: "50 Union Ave, New Haven CT 06519" },
    { label: "Tweed New Haven Airport (HVN)", address: "155 Burr St, New Haven CT 06512" },
    { label: "Bradley Intl Airport (BDL)", address: "Schoephoester Rd, Windsor Locks CT 06096" },
    { label: "JFK Airport", address: "Queens NY 11430" },
    { label: "LaGuardia Airport (LGA)", address: "Queens NY 11371" },
    { label: "Newark Liberty Airport (EWR)", address: "3 Brewster Rd, Newark NJ 07114" },
  
    /* ——— Shopping / essentials ——— */
    { label: "IKEA New Haven", address: "450 Sargent Dr, New Haven CT 06511" },
    { label: "Target New Haven", address: "310 Foxon Blvd, New Haven CT 06513" },
    { label: "Trader Joe's (Orange CT)", address: "230 Boston Post Rd, Orange CT 06477" },
    { label: "Stop & Shop (Whalley Ave)", address: "150 Whalley Ave, New Haven CT 06511" },
  
    /* ——— Student hot‑spots ——— */
    { label: "Yale Bowl", address: "81 Central Ave, New Haven CT 06515" },
    { label: "Toad's Place", address: "300 York St, New Haven CT 06511" },
    { label: "Claire's Corner Copia", address: "1000 Chapel St, New Haven CT 06510" },
    { label: "Louis' Lunch", address: "261 Crown St, New Haven CT 06511" },
  
    /* ——— Nearby universities / cities ——— */
    { label: "Harvard University", address: "Cambridge MA 02138" },
    { label: "MIT", address: "77 Massachusetts Ave, Cambridge MA 02139" },
    { label: "Brown University", address: "Providence RI 02912" },
    { label: "University of Connecticut", address: "Storrs CT 06269" },
  ];
  