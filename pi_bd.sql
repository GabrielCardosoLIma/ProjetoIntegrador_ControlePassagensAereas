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
DROP SEQUENCE SEQ_TRECHOS;
DROP SEQUENCE SEQ_VOOS;
DROP SEQUENCE SEQ_PAGAMENTO;

-- CREATE TABLES E SEQUENCES

CREATE SEQUENCE SEQ_AERONAVES START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_AEROPORTOS START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_ASSENTOS START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_TRECHOS START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_VOOS START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_PAGAMENTO START WITH 1 INCREMENT BY 1;

CREATE TABLE TB_Aeronaves (
 id_aeronave INT PRIMARY KEY,
 modelo VARCHAR(30) NOT NULL,
 fabricante VARCHAR(100) NOT NULL,
 ano_fabricacao INT NOT NULL,
 total_assentos INT NOT NULL
);

CREATE TABLE TB_Aeroportos (
 id_aeroporto INT PRIMARY KEY,
 sigla VARCHAR(5),
 nome VARCHAR(100),
 cidade VARCHAR(30),
 pais VARCHAR(30)
);

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
 id_pagamento INT PRIMARY KEY,
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
INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 737', 'Boeing', 2020, 150);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A320', 'Airbus', 2019, 180);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Embraer E190', 'Embraer', 2018, 100);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 747', 'Boeing', 2017, 300);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A380', 'Airbus', 2016, 250);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Bombardier CRJ-900', 'Bombardier', 2022, 190);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 777', 'Boeing', 2021, 300);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A330', 'Airbus', 2020, 250);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Embraer E175', 'Embraer', 2019, 180);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 787', 'Boeing', 2018, 240);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A350', 'Airbus', 2017, 300);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Bombardier Q400', 'Bombardier', 2016, 170);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 767', 'Boeing', 2015, 180);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A319', 'Airbus', 2014, 140);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Embraer E145', 'Embraer', 2013, 150);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 737 MAX', 'Boeing', 2022, 170);

INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A321', 'Airbus', 2021, 200);


INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Bombardier CRJ-700', 'Bombardier', 2020, 170);


INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Boeing 757', 'Boeing', 2019, 180);


INSERT INTO TB_Aeronaves (id_aeronave, modelo, fabricante, ano_fabricacao, total_assentos)
VALUES (SEQ_AERONAVES.nextval, 'Airbus A330neo', 'Airbus', 2018, 260);

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
VALUES (SEQ_AEROPORTOS.nextval, 'MUC', 'Munich Airport', 'Munich', 'Germany');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States');

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
VALUES (SEQ_AEROPORTOS.nextval, 'CAN', 'Guangzhou Baiyun International Airport', 'Guangzhou', 'China');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'MAD', 'Adolfo Su�rez Madrid�Barajas Airport', 'Madrid', 'Spain');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'BKK', 'Suvarnabhumi Airport', 'Bangkok', 'Thailand');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', 'Netherlands');

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
VALUES (SEQ_AEROPORTOS.nextval, 'PEK', 'Beijing Capital International Airport', 'Beijing', 'China');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'NRT', 'Narita International Airport', 'Tokyo', 'Japan');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'VCP', 'Aeroporto Internacional de Viracopos', 'Campinas', 'Brasil');

INSERT INTO TB_Aeroportos (id_aeroporto, sigla, nome, cidade, pais)
VALUES (SEQ_AEROPORTOS.nextval, 'GRU', 'Aeroporto Internacional de Guarulhos', 'Guarulhos', 'Brasil');

-- INSERT TABELA TRECHO

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 1);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 2);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 3);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 4);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 5);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 6);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 7);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 8);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 9);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 10);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 11);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 12);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 13);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 14);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 15);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 16);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 17);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 18);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 19);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 20);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 21);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 22);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 23);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 24);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 25);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 26);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 27);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 28);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 29, 30);

INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 1, 5);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 2, 25);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 3, 24);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 4, 23);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 5, 22);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 6, 21);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 7, 20);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 8, 19);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 9, 18);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 10,17);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 11,16);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 12, 15);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 13, 14);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 14, 13);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 15,12);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 16, 11);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 17, 10);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 18, 9);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 19, 8);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 20, 7);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 21, 6);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 22, 5);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 23, 4);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 24,3);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 25, 2);
INSERT INTO TB_Trechos (id_trecho, fk_id_origem, fk_id_destino) VALUES (SEQ_TRECHOS.nextval, 26, 1);




-- INSERT TABELA VOO
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 08:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 05:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('30/12/2023 11:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('30/12/2023 08:45', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 1, 1, 2350.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('15/12/2023 09:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('15/12/2023 06:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('31/12/2023 12:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('31/12/2023 09:45', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 2, 2, 2450.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('16/12/2023 10:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('16/12/2023 07:00', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('01/01/2024 13:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('01/01/2024 11:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 3, 3, 2600.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('17/12/2023 11:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('17/12/2023 08:45', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('02/01/2024 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('02/01/2024 12:30', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 4, 4, 2250.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('18/12/2023 12:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('18/12/2023 09:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('03/01/2024 16:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('03/01/2024 14:00', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 5, 5, 2700.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('19/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('19/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('04/01/2024 17:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('04/01/2024 15:00', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 6, 6, 2550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 08:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 05:30', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 1, 1, 2350.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('15/12/2023 09:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('15/12/2023 06:15', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 2, 2, 2450.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('16/12/2023 10:00', 'DD/MM/YYYY HH24:MI'), TO_DATE('16/12/2023 07:00', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'null', 3, 3, 2600.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('17/12/2023 11:45', 'DD/MM/YYYY HH24:MI'), TO_DATE('17/12/2023 08:45', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 22, 4, 2250.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('18/12/2023 12:30', 'DD/MM/YYYY HH24:MI'), TO_DATE('18/12/2023 09:30', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 44, 5, 2700.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('19/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('19/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 35, 6, 2550.00);

--
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 1, 7, 2550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 7:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 1, 8, 2550.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 1, 8, 2350.00);  
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 20:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 18:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 1, 8, 1350.00);  


INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 1, 7, 2550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 7:15', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 1, 8, 2550.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 1, 8, 2350.00);  
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 1, 8, 1350.00);


INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('15/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('22/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('22/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 2, 7, 2550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('15/12/2023 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('15/12/2023 7:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('22/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('22/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 2, 9, 2550.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('16/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('16/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 2, 10, 2350.00);  
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('17/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('17/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('23/12/2023 20:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('23/12/2023 18:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 2, 11, 1350.00);
        

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 2, 7, 2550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 7:15', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 2, 8, 2550.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida',2, 10, 2350.00);  
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 2, 11, 1350.00);


INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 2, 12, 2550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 7:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 2, 14, 2550.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 2, 11, 2350.00);  
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 20:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 18:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 2, 8, 1350.00);  


INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 3, 12, 2550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 7:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 3, 14, 2550.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta',3, 11, 2350.00);  
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 20:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 18:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 3, 8, 1350.00);  
        

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 3, 12, 2550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 7:15', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 3, 14, 2550.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida',3, 11, 2350.00);  
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        null, null,
        'ida', 3, 8, 1350.00);


INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 4, 12, 2550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 7:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 4, 14, 2550.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta',4, 11, 2350.00);  
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 20:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 18:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 4, 19, 1350.00);


INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 5, 12, 2550.00);

INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 10:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 7:15', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 5, 14, 2550.00);
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 13:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 10:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta',5, 11, 2350.00);  
        
INSERT INTO TB_Voo (id_voo, hora_data_chegada_ida, hora_data_saida_ida, hora_data_chegada_volta,
                    hora_data_saida_volta, tipo, fk_id_trecho, fk_id_aeronave, preco)
VALUES (SEQ_VOOS.nextval, TO_DATE('14/12/2023 15:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('14/12/2023 12:30', 'DD/MM/YYYY HH24:MI'),
        TO_DATE('21/12/2023 20:15', 'DD/MM/YYYY HH24:MI'), TO_DATE('21/12/2023 18:15', 'DD/MM/YYYY HH24:MI'),
        'ida_volta', 5, 19, 1350.00);

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