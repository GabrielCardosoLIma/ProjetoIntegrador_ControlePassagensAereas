export type Voos = {
  ID_VOO?: number;
  HORA_DATA_CHEGADA_IDA?: Date;
  HORA_DATA_SAIDA_IDA?: Date;
  HORA_DATA_CHEGADA_VOLTA?: Date;
  HORA_DATA_SAIDA_VOLTA?: Date;
  TIPO: string;
  FK_ID_TRECHO?: number;
  FK_ID_AERONAVE?: number;
  PRECO?: number;
};
