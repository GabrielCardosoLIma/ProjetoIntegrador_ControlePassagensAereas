DELETE FROM TB_Trechos;
DELETE FROM TB_Assento;
DELETE FROM TB_Voo;
DELETE FROM TB_Mapa_assentos;
DELETE FROM TB_Aeroportos;
DELETE FROM TB_Aeronaves;
DELETE FROM TB_Pagamento;

DROP TABLE TB_Trechos;
DROP TABLE TB_Assento;
DROP TABLE TB_Voo;
DROP TABLE TB_Mapa_assentos;
DROP TABLE TB_Aeroportos;
DROP TABLE TB_Aeronaves;
DROP TABLE TB_Pagamento;

DROP SEQUENCE SEQ_AEROPORTOS;
DROP SEQUENCE SEQ_AERONAVES;
DROP SEQUENCE SEQ_ASSENTOS;

-- CREATE TABLES E SEQUENCES

CREATE TABLE TB_Aeronaves (
 id_aeronave INT PRIMARY KEY,
 modelo VARCHAR(30) NOT NULL,
 fabricante VARCHAR(100) NOT NULL,
 ano_fabricacao INT NOT NULL,
 companhia VARCHAR(100) NOT NULL,
 total_assentos INT NOT NULL
);

CREATE SEQUENCE SEQ_AERONAVES START WITH 1 INCREMENT BY 1;

CREATE TABLE TB_Aeroportos (
 id_aeroporto INT PRIMARY KEY,
 sigla VARCHAR(5),
 nome VARCHAR(100),
 cidade VARCHAR(30),
 pais VARCHAR(30)
);

CREATE SEQUENCE SEQ_AEROPORTOS START WITH 1 INCREMENT BY 1;

CREATE TABLE TB_Trechos (
 id_trecho INT PRIMARY KEY,
 fk_id_origem INT,
 fk_id_destino INT,
 FOREIGN KEY (fk_id_origem) REFERENCES TB_Aeroportos(id_aeroporto),
 FOREIGN KEY (fk_id_destino) REFERENCES TB_Aeroportos(id_aeroporto)
);

CREATE TABLE TB_Voo (
 id_voo INT PRIMARY KEY,
 hora_data_chegada_ida DATE,
 hora_data_saida_ida DATE,
 hora_data_chegada_volta DATE,
 hora_data_saida_volta DATE,
 tipo VARCHAR(30),
 fk_id_trecho INT,
 fk_id_aeronave INT,
 preco DECIMAL(10, 2),
 FOREIGN KEY (fk_id_trecho) REFERENCES TB_Trechos(id_trecho),
 FOREIGN KEY (fk_id_aeronave) REFERENCES TB_Aeronaves(id_aeronave)
);

CREATE TABLE TB_Assento (
 id_assento INT PRIMARY KEY,
 status VARCHAR(15),
 referencia VARCHAR(10),
 fk_id_aeronave INT,
 FOREIGN KEY (fk_id_aeronave) REFERENCES TB_Aeronaves(id_aeronave)
);

CREATE SEQUENCE SEQ_ASSENTOS START WITH 1 INCREMENT BY 1;

CREATE TABLE TB_Mapa_assentos (
 id_mapa_assentos INT PRIMARY KEY,
 fk_id_voo INT,
 fk_id_assento INT,
 fk_referencia_assento VARCHAR(10),
 ocupacao VARCHAR(15),
 nome_passageiro VARCHAR(50),
 FOREIGN KEY (fk_id_voo) REFERENCES TB_Voo(id_voo),
 FOREIGN KEY (fk_id_assento) REFERENCES TB_Assento(id_assento)
);

CREATE TABLE TB_Pagamento (
 metodo VARCHAR(30),
 nome VARCHAR(100),
 email VARCHAR(100),
 status VARCHAR(30)
);

-- CREATE TRIGGER PARA GERAR OS ASSENTOS

CREATE OR REPLACE TRIGGER TG_GERAR_ASSENTOS_TB_Aeroportos
AFTER INSERT ON TB_Aeronaves
FOR EACH ROW
DECLARE
    v_num_assento INTEGER := 0;
BEGIN
    v_num_assento := :new.total_assentos;

    FOR i IN 1..v_num_assento LOOP
        INSERT INTO TB_Assento (id_assento, status, referencia, fk_id_aeronave)
        VALUES (SEQ_ASSENTOS.nextval, 'normal', null, :new.id_aeronave);
    END LOOP;
END;

-- INSERT TABELA AERONAVES
INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 737', 'Boeing', 2020, 'American Airlines', 150);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A320', 'Airbus', 2019, 'Delta Air Lines', 180);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Embraer E190', 'Embraer', 2018, 'United Airlines', 100);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 747', 'Boeing', 2017, 'Lufthansa', 300);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A380', 'Airbus', 2016, 'British Airways', 250);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Bombardier CRJ-900', 'Bombardier', 2022, 'Air Canada', 190);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 777', 'Boeing', 2021, 'Emirates', 300);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A330', 'Airbus', 2020, 'Qatar Airways', 250);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Embraer E175', 'Embraer', 2019, 'JetBlue Airways', 180);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 787', 'Boeing', 2018, 'ANA All Nippon Airways', 240);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A350', 'Airbus', 2017, 'Singapore Airlines', 300);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Bombardier Q400', 'Bombardier', 2016, 'Alaska Airlines', 170);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 767', 'Boeing', 2015, 'Delta Air Lines', 180);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A319', 'Airbus', 2014, 'EasyJet', 140);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Embraer E145', 'Embraer', 2013, 'American Eagle', 150);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 737 MAX', 'Boeing', 2022, 'Southwest Airlines', 170);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A321', 'Airbus', 2021, 'JetBlue Airways', 200);


INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Bombardier CRJ-700', 'Bombardier', 2020, 'Delta Connection', 170);


INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 757', 'Boeing', 2019, 'Icelandair', 180);


INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, companhia, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A330neo', 'Airbus', 2018, 'TAP Air Portugal', 260);

-- INSERT TABELA AEROPORTOS

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'JFK', 'John F. Kennedy International Airport', 'New York', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'LHR', 'London Heathrow Airport', 'London', 'United Kingdom');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'CDG', 'Charles de Gaulle Airport', 'Paris', 'France');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'ATL', 'Hartsfield-Jackson Atlanta International Airport', 'Atlanta', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'HND', 'Haneda Airport', 'Tokyo', 'Japan');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'DXB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'HKG', 'Hong Kong International Airport', 'Hong Kong', 'China');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'ORD', 'O Hare International Airport', 'Chicago', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'DFW', 'Dallas/Fort Worth International Airport', 'Dallas', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'DEN', 'Denver International Airport', 'Denver', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'ICN', 'Incheon International Airport', 'Seoul', 'South Korea');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'MUC', 'Munich Airport', 'Munich', 'Germany');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', 'Netherlands');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'IAH', 'George Bush Intercontinental Airport', 'Houston', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'SFO', 'San Francisco International Airport', 'San Francisco', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'PVG', 'Shanghai Pudong International Airport', 'Shanghai', 'China');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'JNB', 'OR Tambo International Airport', 'Johannesburg', 'South Africa');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'MIA', 'Miami International Airport', 'Miami', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'SYD', 'Sydney Airport', 'Sydney', 'Australia');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'PEK', 'Beijing Capital International Airport', 'Beijing', 'China');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'CAN', 'Guangzhou Baiyun International Airport', 'Guangzhou', 'China');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'MAD', 'Adolfo Su�rez Madrid�Barajas Airport', 'Madrid', 'Spain');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'BKK', 'Suvarnabhumi Airport', 'Bangkok', 'Thailand');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'ATL', 'Hartsfield-Jackson Atlanta International Airport', 'Atlanta', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', 'Netherlands');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'MUC', 'Munich Airport', 'Munich', 'Germany');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'ICN', 'Incheon International Airport', 'Seoul', 'South Korea');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'ORD', 'O Hare International Airport', 'Chicago', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'DFW', 'Dallas/Fort Worth International Airport', 'Dallas', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'DEN', 'Denver International Airport', 'Denver', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'IST', 'Istanbul Airport', 'Istanbul', 'Turkey');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'PEK', 'Beijing Capital International Airport', 'Beijing', 'China');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'DXB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'HKG', 'Hong Kong International Airport', 'Hong Kong', 'China');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'NRT', 'Narita International Airport', 'Tokyo', 'Japan');

-- INSERT TABELA TRECHO

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (1, 15, 20);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (2, 3, 4);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (3, 8, 9);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (4, 35, 36);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (5, 2, 17);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (6, 25, 26);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (7, 29, 30);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (8, 19, 24);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (9, 4, 5);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (10, 22, 23);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (11, 33, 38);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (12, 13, 14);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (13, 6, 7);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (14, 16, 31);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (15, 10, 11);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (16, 12, 37);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (17, 27, 28);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (18, 40, 1);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (19, 39, 2);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (20, 21, 22);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (21, 18, 19);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (22, 7, 8);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (23, 26, 27);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (24, 9, 10);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (25, 31, 32);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (26, 23, 33);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (27, 30, 35);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (28, 16, 17);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (29, 37, 18);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (30, 14, 15);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (31, 34, 39);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (32, 5, 6);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (33, 28, 29);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (34, 36, 11);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (35, 32, 3);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (36, 25, 40);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (37, 24, 25);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (38, 20, 21);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (39, 38, 13);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino)
VALUES (40, 33, 34);

-- INSERT TABELA VOO
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (1, TO_DATE('01/01/2024 08:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('01/01/2024 12:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('02/01/2024 14:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('02/01/2024 18:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 1, 1, 500.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (2, TO_DATE('02/01/2024 10:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('02/01/2024 13:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('03/01/2024 16:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('03/01/2024 20:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 2, 2, 550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (3, TO_DATE('03/01/2024 12:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('03/01/2024 16:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('04/01/2024 18:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('04/01/2024 22:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 3, 3, 480.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (4, TO_DATE('05/01/2024 09:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('05/01/2024 13:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('06/01/2024 15:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('06/01/2024 19:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 4, 4, 520.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (5, TO_DATE('07/01/2024 11:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('07/01/2024 14:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('08/01/2024 17:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('08/01/2024 20:45', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 5, 5, 600.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (6, TO_DATE('09/01/2024 13:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('09/01/2024 17:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('10/01/2024 19:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('10/01/2024 23:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 6, 6, 480.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (7, TO_DATE('11/01/2024 15:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('11/01/2024 18:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('12/01/2024 21:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('12/01/2024 01:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 7, 7, 550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (8, TO_DATE('13/01/2024 17:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('13/01/2024 20:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('14/01/2024 22:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('15/01/2024 02:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 8, 8, 580.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (9, TO_DATE('16/01/2024 18:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('16/01/2024 22:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('17/01/2024 00:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('17/01/2024 04:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 9, 9, 520.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (10, TO_DATE('18/01/2024 20:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('19/01/2024 00:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('19/01/2024 03:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('19/01/2024 06:45', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 10, 10, 650.00);
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (11, TO_DATE('20/01/2024 22:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/01/2024 02:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/01/2024 05:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/01/2024 09:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 11, 11, 700.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (12, TO_DATE('22/01/2024 01:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('22/01/2024 05:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('22/01/2024 08:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('22/01/2024 11:45', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 12, 12, 750.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (13, TO_DATE('23/01/2024 03:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('23/01/2024 07:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('23/01/2024 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('23/01/2024 14:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 13, 13, 800.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (14, TO_DATE('24/01/2024 05:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('24/01/2024 10:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('24/01/2024 12:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('24/01/2024 16:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 14, 14, 850.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (15, TO_DATE('25/01/2024 08:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('25/01/2024 12:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('25/01/2024 14:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('25/01/2024 18:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 15, 15, 900.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (16, TO_DATE('26/01/2024 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('26/01/2024 14:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('26/01/2024 17:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('26/01/2024 20:45', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 16, 16, 950.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (17, TO_DATE('27/01/2024 12:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('27/01/2024 16:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('27/01/2024 19:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('27/01/2024 23:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 17, 17, 1000.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (18, TO_DATE('28/01/2024 14:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('28/01/2024 19:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('28/01/2024 21:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('29/01/2024 01:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 18, 18, 1050.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (19, TO_DATE('30/01/2024 17:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('30/01/2024 21:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('31/01/2024 23:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('01/02/2024 03:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 19, 19, 1100.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (20, TO_DATE('02/02/2024 19:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('02/02/2024 23:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('03/02/2024 02:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('03/02/2024 05:45', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 20, 20, 1150.00);
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (21, TO_DATE('05/02/2024 21:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('06/02/2024 01:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('06/02/2024 04:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('06/02/2024 08:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 21, 1, 1200.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (22, TO_DATE('07/02/2024 01:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('07/02/2024 06:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('07/02/2024 08:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('07/02/2024 12:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 22, 2, 1250.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (23, TO_DATE('08/02/2024 04:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('08/02/2024 08:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('08/02/2024 10:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('08/02/2024 14:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 23, 3, 1300.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (24, TO_DATE('09/02/2024 06:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('09/02/2024 10:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('09/02/2024 13:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('09/02/2024 16:45', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 24, 4, 1350.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (25, TO_DATE('10/02/2024 08:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('10/02/2024 12:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('10/02/2024 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('10/02/2024 19:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 25, 5, 1400.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (26, TO_DATE('11/02/2024 10:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('11/02/2024 15:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('11/02/2024 17:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('11/02/2024 21:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 26, 6, 1450.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (27, TO_DATE('12/02/2024 12:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('12/02/2024 16:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('12/02/2024 18:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('12/02/2024 22:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 27, 7, 1500.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (28, TO_DATE('13/02/2024 14:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('13/02/2024 18:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('13/02/2024 21:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/02/2024 01:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 28, 8, 1550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (29, TO_DATE('15/02/2024 16:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('15/02/2024 20:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('15/02/2024 23:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('16/02/2024 03:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 29, 9, 1600.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (30, TO_DATE('17/02/2024 18:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('17/02/2024 23:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('18/02/2024 01:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('18/02/2024 05:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 30, 10, 1650.00);
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (31, TO_DATE('19/02/2024 21:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('20/02/2024 01:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('20/02/2024 03:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('20/02/2024 07:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 31, 11, 1700.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (32, TO_DATE('21/02/2024 01:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/02/2024 05:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/02/2024 08:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/02/2024 12:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 32, 12, 1750.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (33, TO_DATE('22/02/2024 04:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('22/02/2024 08:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('22/02/2024 11:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('22/02/2024 15:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 33, 13, 1800.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (34, TO_DATE('23/02/2024 06:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('23/02/2024 11:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('23/02/2024 13:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('23/02/2024 17:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 34, 14, 1850.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (35, TO_DATE('24/02/2024 08:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('24/02/2024 12:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('24/02/2024 14:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('24/02/2024 18:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 35, 15, 1900.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (36, TO_DATE('25/02/2024 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('25/02/2024 14:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('25/02/2024 17:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('25/02/2024 20:45', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 36, 16, 1950.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (37, TO_DATE('26/02/2024 12:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('26/02/2024 16:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('26/02/2024 19:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('26/02/2024 23:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 37, 17, 2000.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (38, TO_DATE('27/02/2024 14:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('27/02/2024 19:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('27/02/2024 21:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('28/02/2024 01:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 38, 18, 2050.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (39, TO_DATE('01/03/2024 17:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('01/03/2024 21:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('01/03/2024 23:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('02/03/2024 03:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 39, 19, 2100.00);

INSERT INTO TB_Voo (id_voo,hora_data_chegada_ida,hora_data_saida_ida,hora_data_chegada_volta,
hora_data_saida_volta,tipo,fk_id_trecho,fk_id_aeronave,preco)
VALUES (40,TO_DATE('03/03/2024 19:15', 'DD/MM/YYYY HH24:MI'),TO_DATE('03/03/2024 23:30', 'DD/MM/YYYY HH24:MI'),
TO_DATE('04/03/2024 02:00', 'DD/MM/YYYY HH24:MI'),TO_DATE('04/03/2024 05:45', 'DD/MM/YYYY HH24:MI'),
'IDA_E_VOLTA',1,20,2150.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (41, TO_DATE('05/03/2024 21:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('06/03/2024 01:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('06/03/2024 04:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('06/03/2024 08:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 2, 1, 2200.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (42, TO_DATE('07/03/2024 23:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('08/03/2024 04:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('08/03/2024 06:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('08/03/2024 10:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 3, 12, 2250.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (43, TO_DATE('09/03/2024 02:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('09/03/2024 06:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('09/03/2024 08:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('09/03/2024 12:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 4, 13, 2300.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (44, TO_DATE('10/03/2024 04:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('10/03/2024 08:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('10/03/2024 11:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('10/03/2024 14:45', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 4, 14, 2350.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (45, TO_DATE('11/03/2024 06:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('11/03/2024 10:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('11/03/2024 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('11/03/2024 17:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 5, 15, 2400.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (46, TO_DATE('12/03/2024 08:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('12/03/2024 13:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('12/03/2024 15:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('12/03/2024 19:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 6, 16, 2450.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (47, TO_DATE('13/03/2024 12:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('13/03/2024 16:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('13/03/2024 18:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('13/03/2024 22:30', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 7, 17, 2500.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (48, TO_DATE('14/03/2024 14:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/03/2024 18:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('14/03/2024 21:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('15/03/2024 01:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 8, 18, 2550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (49, TO_DATE('16/03/2024 17:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('16/03/2024 21:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('17/03/2024 00:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('17/03/2024 04:00', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 9, 19, 2600.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (50, TO_DATE('18/03/2024 19:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('19/03/2024 00:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('19/03/2024 02:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('19/03/2024 06:15', 'DD/MM/YYYY HH24:MI'),
        'IDA_E_VOLTA', 20, 5, 2650.00);

-- SELECTS

SELECT * FROM TB_Aeronaves;
SELECT * FROM TB_Aeroportos;
SELECT * FROM TB_Trechos;
SELECT * FROM TB_Voo;
SELECT * FROM TB_Mapa_assentos;
SELECT * FROM TB_Pagamento;
SELECT * FROM TB_Assento WHERE fk_id_aeronave = 1;

-- COMMIT
commit;