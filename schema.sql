-- Table: public.list_movies

DROP TABLE IF EXISTS public.list_movies;

CREATE TABLE IF NOT EXISTS public.list_movies
(
    movie_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    movie_name character varying(500) COLLATE pg_catalog."default",
    poster_path character varying(10000) COLLATE pg_catalog."default",
    overview character varying(10000) COLLATE pg_catalog."default",
    CONSTRAINT list_movies_pkey PRIMARY KEY (movie_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.list_movies
    OWNER to obieda;