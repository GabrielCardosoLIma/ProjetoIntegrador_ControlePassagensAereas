class Aeronaves {
    public Modelo?: string;
    public n_identificacao? : string;
    public fabricante? : string;
    public ano_fabricacao? : number;
    public Mapa_ass? : number;
}

class Cidades {
    public Nome_cidade? : string;
}

class Aeroportos {
    public Nome_aero? : string;
    public Nome_cidade? : string;

}

class Trechos {
    public Id_trecho? : number;
    public Origem? : string;
    public Destino? : string;

}

class Voos {
    public N_voo? : string;
    public Data_voo? : Date;
    public Id_trecho? : number;
    public H_partida? : string;
    public H_chegada? : string;
    public Aero_origem? : string;
    public Aero_chegada? : string;
    public Valor_ass? : number;

}