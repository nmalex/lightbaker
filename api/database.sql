CREATE SEQUENCE job_id_seq;

CREATE TABLE public.job (
    id integer NOT NULL DEFAULT nextval('job_id_seq'),
    createdat timestamp with time zone DEFAULT now() NOT NULL,
    guid text,
    filename text,
    originalname text,
    filepath text,
    mimetype text,
    filesize integer,
    status text
);

ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id);

ALTER SEQUENCE job_id_seq OWNED BY job.id;
