CREATE SEQUENCE job_id_seq;
CREATE TABLE job (
    id integer NOT NULL DEFAULT nextval('job_id_seq')
);
ALTER SEQUENCE job_id_seq OWNED BY job.id;
