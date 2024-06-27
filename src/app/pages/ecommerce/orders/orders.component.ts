import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import { fadeInRightAnimation } from 'src/app/core/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { scaleInAnimation } from 'src/app/core/animations/scale-in.animation';

interface Transaction {
  DATE: string;
  TIME: string;
  OUT_IP: string;
  IN_IP: string;
  GEO_OUT: string;
  GEO_IN: string;
  CARRIER: string;
  PROD: string;
  AMOUNT: number;
  PHONE: string;
  TRN: number;
  ST: string;
  T_TIME: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation, scaleInAnimation]
})
export class OrdersComponent implements OnInit {
  transactions: Transaction[] = [
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:19",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****277870",
      "TRN": 576428,
      "ST": "00",
      "T_TIME": 21
    },
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:27",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA50",
      "AMOUNT": 50,
      "PHONE": "****045075",
      "TRN": 301791,
      "ST": "00",
      "T_TIME": 8
    },
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:15",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA50",
      "AMOUNT": 50,
      "PHONE": "****939158",
      "TRN": 930423,
      "ST": "00",
      "T_TIME": 2
    },
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:15",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****495463",
      "TRN": 913591,
      "ST": "00",
      "T_TIME": 4
    },
    {
      "DATE": "2024/02/28",
      "TIME": "13:16:22",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA50",
      "AMOUNT": 50,
      "PHONE": "****531177",
      "TRN": 503793,
      "ST": "00",
      "T_TIME": 3
    },
    {
      "DATE": "2024/02/28",
      "TIME": "13:16:22",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****162textX8",
      "TRN": 218432,
      "ST": "00",
      "T_TIME": 1
    },
    {
      "DATE": "2024/02/28",
      "TIME": "13:16:11",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA150",
      "AMOUNT": 150,
      "PHONE": "****758028",
      "TRN": 616797,
      "ST": "00",
      "T_TIME": 6
    },
    {
      "DATE": "2024/02/28",
      "TIME": "13:16:12",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "TAE050",
      "AMOUNT": 50,
      "PHONE": "****467508",
      "TRN": 803206,
      "ST": "00",
      "T_TIME": 6
    },
    {
      "DATE": "2024/02/28",
      "TIME": "13:16:13",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA50",
      "AMOUNT": 50,
      "PHONE": "****137526",
      "TRN": 548170,
      "ST": "00",
      "T_TIME": 1
    },
    {
      "DATE": "2024/02/28",
      "TIME": "13:16:09",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA200",
      "AMOUNT": 200,
      "PHONE": "****071464",
      "TRN": 450390,
      "ST": "00",
      "T_TIME": 8
    },
    {
      "DATE": "2024/05/01",
      "TIME": "13:16:09",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****223468",
      "TRN": 995317,
      "ST": "00",
      "T_TIME": 5
    },
    {
      "DATE": "2024/05/01",
      "TIME": "13:16:10",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA100",
      "AMOUNT": 100,
      "PHONE": "****442496",
      "TRN": 271598,
      "ST": "00",
      "T_TIME": 2
    },
    {
      "DATE": "2024/05/01",
      "TIME": "13:16:09",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA100",
      "AMOUNT": 100,
      "PHONE": "****216019",
      "TRN": 221547,
      "ST": "00",
      "T_TIME": 6
    },
    {
      "DATE": "2024/05/01",
      "TIME": "13:16:12",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA150",
      "AMOUNT": 150,
      "PHONE": "****063845",
      "TRN": 799697,
      "ST": "00",
      "T_TIME": 8
    },
    {
      "DATE": "2024/05/01",
      "TIME": "13:16:07",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA30",
      "AMOUNT": 30,
      "PHONE": "****387321",
      "TRN": 958765,
      "ST": "00",
      "T_TIME": 8
    },
    {
      "DATE": "2024/05/01",
      "TIME": "13:16:07",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA30",
      "AMOUNT": 30,
      "PHONE": "****166432",
      "TRN": 803741,
      "ST": "00",
      "T_TIME": 6
    },
    {
      "DATE": "2024/05/01",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****392380",
      "TRN": 960390,
      "ST": "00",
      "T_TIME": 9
    },
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:06",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "TAE030",
      "AMOUNT": 30,
      "PHONE": "****416182",
      "TRN": 191828,
      "ST": "00",
      "T_TIME": 3
    },
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:07",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA200",
      "AMOUNT": 200,
      "PHONE": "****504430",
      "TRN": 626498,
      "ST": "00",
      "T_TIME": 1
    },
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/05/10",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    },
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    },
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
    ,
    {
      "DATE": "2024/02/26",
      "TIME": "13:16:05",
      "OUT_IP": "189.240.98.226",
      "IN_IP": "54.163.211.222",
      "GEO_OUT": "MEXICO UNINET",
      "GEO_IN": "EE.UU ASHBURN AMAZON",
      "CARRIER": "TELCEL",
      "PROD": "PA20",
      "AMOUNT": 20,
      "PHONE": "****744625",
      "TRN": 831396,
      "ST": "00",
      "T_TIME": 2
    }
  ];
  filteredTransactions: Transaction[] = [];
  pageSizeOptions = [10, 50, 100, 200];
  pageSize = 10;
  currentPage = 0;
  totalRecords = 0;
  totalPages = 0;
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  showTotalRecordsMessage: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.filteredTransactions = this.transactions;
    this.totalRecords = this.transactions.length;
    this.updateTotalPages();
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  performSearch(): void {
    this.filterTransactions();
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.updateTotalPages();
    this.filterTransactions();
  }

  onNextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalRecords) {
      this.currentPage++;
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  get startIndex(): number {
    return this.currentPage * this.pageSize;
  }

  get endIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalRecords);
  }

  filterByDateRange(): void {
    this.filterTransactions();
  }

  filterTransactions(): void {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.DATE);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      let matchesDateRange = true;
      if (start && end) {
        matchesDateRange = transactionDate >= start && transactionDate <= end;
      } else if (start) {
        matchesDateRange = transactionDate >= start;
      } else if (end) {
        matchesDateRange = transactionDate <= end;
      }

      let matchesSearchTerm = Object.values(transaction).some(val =>
        val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      return matchesDateRange && matchesSearchTerm;
    });

    this.totalRecords = this.filteredTransactions.length;
    this.updateTotalPages();
    this.currentPage = 0;
    this.showTotalRecordsMessage = !!this.startDate || !!this.endDate;
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredTransactions);
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    const headerCols = [];
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const headerCellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      headerCols.push({ wch: worksheet[headerCellRef].v.toString().length + 5 });
      worksheet[headerCellRef].s = {
        font: { bold: true, color: { rgb: 'd40c0c' } }
      };
    }
    worksheet['!cols'] = headerCols;
    const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
    XLSX.writeFile(workbook, 'Transacciones.xlsx');
  }

  private getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
  }

  async exportToPDF(): Promise<void> {
    const doc = new jsPDF('landscape');
    const imgUrl = '../../../../assets/images/logoTECSA.png';
    const imgData = await this.getBase64ImageFromURL(imgUrl);

    const imgX = 15;
    const imgY = 14;
    const imgWidth = 20;
    const imgHeight = 12;

    doc.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);

    const lineX = imgX + imgWidth + 5;
    const lineY1 = imgY;
    const lineY2 = imgY + imgHeight;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(lineX, lineY1, lineX, lineY2);

    const textX = lineX + 5;
    const textYStart = 13;
    const textLineHeight = 5;

    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.text('Konnecta System 7.0', textX, textYStart);
    doc.text('CLIENT : TECSA/INGFRAC', textX, textYStart + textLineHeight);
    doc.text('NAME : INGFRAC DISEÑO Y CONSTRUCCIÓN SA DE CV', textX, textYStart + 2 * textLineHeight);
    doc.text('SEND TO : STARCCLOUD CONNECT LLC', textX, textYStart + 3 * textLineHeight);
    doc.text('TYPE : MX PIPE', 200, 23);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = currentDate.toLocaleTimeString('es-ES');
    const dateTimeText = `${formattedDate}, ${formattedTime}`;
    
    doc.text(dateTimeText, 200, 28);

    (doc as any).autoTable({
      head: [['#', 'DATE', 'TIME', 'OUT IP', 'IN IP', 'GEO OUT', 'GEO IN', 'CARRIER', 'PROD', 'AMOUNT', 'PHONE', 'TRN', 'ST', 'T TIME']],
      body: this.filteredTransactions.map((transaction, index) => [
        index + 1,
        transaction.DATE,
        transaction.TIME,
        transaction.OUT_IP,
        transaction.IN_IP,
        transaction.GEO_OUT,
        transaction.GEO_IN,
        transaction.CARRIER,
        transaction.PROD,
        transaction.AMOUNT,
        transaction.PHONE,
        transaction.TRN,
        transaction.ST,
        transaction.T_TIME,
      ]),
      startY: 30,
      styles: { fontSize: 8, font: 'courier', cellPadding: 1.5, lineHeight: 1 },
      headStyles: { fillColor: [31, 78, 120], textColor: [255, 255, 255], halign: 'center', font: 'courier', fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [255, 255, 255] },
    });

    doc.setFontSize(10);
    doc.text('Tecsa', 14, doc.internal.pageSize.height - 10);

    doc.save('Transacciones.pdf');
  }
}
