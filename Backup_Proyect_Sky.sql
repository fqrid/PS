--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventos (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    descripcion text NOT NULL,
    fecha timestamp without time zone NOT NULL,
    ubicacion public.geometry(Point,4326)
);


ALTER TABLE public.eventos OWNER TO postgres;

--
-- Name: eventos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eventos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eventos_id_seq OWNER TO postgres;

--
-- Name: eventos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eventos_id_seq OWNED BY public.eventos.id;


--
-- Name: tareas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tareas (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    descripcion text NOT NULL,
    estado character varying(50) DEFAULT 'pendiente'::character varying,
    fecha timestamp without time zone DEFAULT now(),
    usuario_asignado_id integer,
    evento_asociado_id integer
);


ALTER TABLE public.tareas OWNER TO postgres;

--
-- Name: tareas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tareas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tareas_id_seq OWNER TO postgres;

--
-- Name: tareas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tareas_id_seq OWNED BY public.tareas.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    correo character varying(255) NOT NULL,
    contrasena character varying(255) NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: eventos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos ALTER COLUMN id SET DEFAULT nextval('public.eventos_id_seq'::regclass);


--
-- Name: tareas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas ALTER COLUMN id SET DEFAULT nextval('public.tareas_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos (id, titulo, descripcion, fecha, ubicacion) FROM stdin;
8	Exp	sjajs	2025-05-31 00:00:00	\N
9	.	.	2025-05-24 00:00:00	\N
14	h	\nhh	2025-05-17 00:00:00	\N
15	saaa	saaa	2025-05-30 00:00:00	\N
21	huh	, -76.650964	2025-05-31 00:00:00	0101000020E6100000DFE00B93A92953C0C2323674B33FF23F
22	Exper	experi	2025-05-31 00:00:00	0101000020E610000038695C52328652C07155FB949DD61140
20	as	as	2025-08-21 00:00:00	0101000020E61000006D2EC0AFD6EB52C0A6239D75FD181240
24	as	sasa	2025-06-20 00:00:00	0101000020E6100000000000884BEC52C08ECC0DAF2E181240
25	aa	aaaaaaa	2025-11-11 00:00:00	0101000020E610000027B4CFBD970253C0820E542E79191240
19	Exp	Ordenar por fechas, el id no haría mucha importancia.. \nOrderby...	2025-05-31 00:00:00	0101000020E610000007E95765F40053C013FA0C9DBF5D1240
26	hhh	hhh	2025-06-26 00:00:00	0101000020E610000000000025E6F052C0EAD0C612D17D1240
23	Examen...	Presentación ejecutiva de proyecto de 1er corte\n	2025-06-07 00:00:00	0101000020E610000001000034712953C0630D621D0578F23F
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: tareas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tareas (id, titulo, descripcion, estado, fecha, usuario_asignado_id, evento_asociado_id) FROM stdin;
26	kl	ojo	pendiente	2025-06-10 00:00:00	\N	\N
7	Comprar materiales 2	Comprar papel y tinta para la impresora	pendiente	2025-05-29 00:00:00	57	8
8	Project	Para sabadoooo exp	pendiente	2025-05-29 16:18:59.111784	\N	\N
10	Investigacion 	idishdias	en progreso	2025-05-29 16:18:59.111784	\N	\N
15	jsjsjs	Oa	pendiente	2025-05-29 16:18:59.111784	\N	\N
20	a	a	en progreso	2025-05-30 00:00:00	\N	\N
17	Exp	Sam pa... 	en progreso	2025-06-01 00:00:00	\N	\N
9	aa	aaa	en progreso	2025-05-29 00:00:00	42	8
23	asasaa	aa	en progreso	2025-06-07 00:00:00	40	21
11	Comprar materiales 2	Comprar papel y tinta para la impresora	pendiente	2025-05-29 00:00:00	37	22
21	a	a	completada	2025-05-13 00:00:00	33	22
16	Comprar materiales 2	Comprar papel y tinta para la impresora	en progreso	2025-05-29 00:00:00	37	23
24	assa	asas	pendiente	2025-06-19 00:00:00	\N	\N
25	sasss	aaaaa	pendiente	2025-07-11 00:00:00	\N	\N
22	Deberes	Tarea: Proyecto de Investigación sobre el Impacto de la Inteligencia Artificial en la Sociedad\nObjetivo: Investigar cómo la inteligencia artificial está transformando diferentes sectores y analizar sus implicaciones en la sociedad moderna.	en progreso	2025-04-01 00:00:00	58	15
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, correo, contrasena) FROM stdin;
31	asssasa	sasassa@itp.edu.co	Deyvidddddddd#12
32	fernandoalbaca22#	fer@gmail.com	fernandoalbaca22#
33	Dartaaaaaaaaaaa#12	Dart@gmail.com	$2b$10$FmIVkmvqnJMhdf.I8sA1ZOWBy1YZm4PcHsMAFyfG4HijohfjgEHfi
34	Alabammmm22#	Alabammmm22#@gmail.com	$2b$10$L6bLYRga/BnO6DDNCKSovugpyRJtW4L8gG4POKnWfFdjJmDRyIoRS
35	Farssjkjasksjkjas12#	fars@gmail.com	$2b$10$MEci2Ztm4CpKU22IfLnBgurs6gQlsGaKRMvK0rG7ngktRn6iRTOR.
37	Deyvid Rodríguez	Darta@gmail.com	$2b$10$CAcCRTlf8rP/mlQgcW2ZVe4IyW9dXrSu3j/Gubvgcl5P7JMWEdU6e
40	sifjifjs	arta@gmail.com	$2b$10$x/QyaDxxWW1UlPcwRbKo8OmFOJNvAledz8GqB3RUG61aKa/XlXI8W
42	Roberto	rarta@gmail.com	$2b$10$Q6OXfvE59N0Sw2J5vzNp1eavOxVmqOFz3PvyDIw0R5rJ/gWOJO0T2
43	Noo	Noo@gmail.com	$2b$10$qJFmWN8yt73ixN3HaiB/2uOP2kA1x70527DMJyCaIlXo9CS5pS/im
44	Nooo	Nooo@gmail.com	$2b$10$mCpsB/rXu/slWs6tqIenzu/IPAZZ/mt81jeMfQEvy4UnTtyolcREy
45	Noooo	Noooo@gmail.com	$2b$10$Qx7jAg8IlNviwC1hQ9zrFOWo7eITzTkrMWhveCI6JQL1lKGFqgG/a
46	Nooaoo	Nooaoo@gmail.com	$2b$10$8LHR16tKrC0OVPIj62qfP.MfW2NODC8ypWOOH1Yumd2y8ntFjiL5e
48	Nooaooa	Nooaooa@gmail.com	$2b$10$s0myBWMSt50ZGY/nAeYFE.wo56H6vcBgJBTEXwcVABnFRaW1q5mDS
53	aNoo	aNoo@gmail.com	$2b$10$6/SUOH2KGNlVpycsM3xbZOZTJ6ETIm.RGXqQw/XlA0blC9aSxSIE2
54	5454	545Nooaooa@gmail.com	$2b$10$n7TOhdusxQMIzrjXPszrpegpKaeHB03pcP12n5rBicZMR5vZlQhP.
55	5454	5454Nooaooa@gmail.com	$2b$10$O/xF6ywACriRrQEqKPX4g.lva5SmB38FVQAFYR3q0xhKn.ZsW2vlm
56	Noosss	Noosss@gmail.com	$2b$10$/1F4jdKkHF6szBbML/XYu.Yc7IpTlgaaYS7svDFMywTna59KW6nc2
57	Noosass	Noosass@gmail.com	$2b$10$QDuLl8aDF/hboRmA4bTYg.ceW3WbgS0qdhr4n2M4mlNpN96Yt/Clm
58	Noosaass	Noosaass@gmail.com	$2b$10$T2L5Y3V8YMWx6F.Sz7s1eOfg9jHoKDGKBD2Xs9JqFkUlpWud9Jb3y
\.


--
-- Name: eventos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_id_seq', 26, true);


--
-- Name: tareas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tareas_id_seq', 26, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 58, true);


--
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id);


--
-- Name: tareas tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_eventos_ubicacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_eventos_ubicacion ON public.eventos USING gist (ubicacion);


--
-- Name: tareas fk_evento_asociado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT fk_evento_asociado FOREIGN KEY (evento_asociado_id) REFERENCES public.eventos(id) ON DELETE SET NULL;


--
-- Name: tareas fk_usuario_asignado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT fk_usuario_asignado FOREIGN KEY (usuario_asignado_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

