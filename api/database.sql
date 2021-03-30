CREATE SEQUENCE file_id_seq;

CREATE TABLE public.file (
    id integer NOT NULL DEFAULT nextval('file_id_seq'),
    userid integer,
    createdat timestamp with time zone DEFAULT now() NOT NULL,
    guid text,
    filename text,
    originalname text,
    filepath text,
    mimetype text,
    filesize integer
);

ALTER TABLE ONLY public.file
    ADD CONSTRAINT file_pkey PRIMARY KEY (id);

ALTER SEQUENCE file_id_seq OWNED BY file.id;
