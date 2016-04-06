-- U¿ytkownicy
drop table if exists public.users cascade;
create table public.users (
	id serial primary key,
	first_name varchar(50) not null,
	last_name varchar(50) not null,
	email varchar(50) not null,
	password_enc varchar(250) not null
)
with (
	oids=false
);

-- Administratorzy
drop table if exists public.administrators cascade;
create table public.administrators (
	id serial primary key,
	user_id int4 unique not null
)
with (
	oids=false
);

-- Recenzenci
drop table if exists public.reviewers cascade;
create table public.reviewers (
	id serial primary key,
	knowledge_fields varchar(250) not null,
	user_id int4 unique not null
)
with (
	oids=false
);

-- Recenzje
drop table if exists public.reviews cascade;
create table public.reviews (
	reviewer_id int4,
	application_id int4,
	opinion varchar(250) not null,
	comment_admin varchar(250) not null,
	topic_rate int2 not null,
	content_rate int2 not null,
	decision varchar(25) not null,
	constraint reviews_pkey primary key (reviewer_id, application_id)
)
with (
	oids=false
);

-- Referaty 
drop table if exists public.papers cascade;
create table public.papers (
	id serial not null primary key,
	topic varchar(100) not null,
	introdution bytea not null,
	main_content bytea not null,
	user_id int4 not null
)
with (
	oids=false
);

-- Zg³oszenia referatów
drop table if exists public.applications cascade;
create table public.applications (
	id serial primary key,
	conference_id int4 not null,
	paper_id int4 not null
)
with (
	oids=false
);

-- Konferencje
drop table if exists public.conferences cascade;
create table public.conferences (
	id serial primary key,
	topic varchar(250) not null,
	conf_datetime timestamp not null,
	fee int2 not null,
	max_places int2 not null,
	location varchar(150) not null,
	administrator_id int4 not null
)
with (
	oids=false
);

-- Przemowy na konferencji
drop table if exists public.speeches cascade;
create table public.speeches (
	conference_id int4,
	paper_id int4 unique,
	duration_in_min int2 not null,
	order_in_conf int2 not null,
	constraint speeches_pkey primary key (conference_id, paper_id)
)
with (
	oids=false
);

-- Noclegi na konferencje
drop table if exists public.accommodations cascade;
create table public.accommodations (
	id serial primary key,
	description varchar(150) not null,
	location varchar(150) not null,
	fee int2 not null,
	conference_id int4 not null
)
with (
	oids=false
);

-- Zapisy na konferencje 
drop table if exists public.entries cascade;
create table public.entries (
	id serial primary key,

	conference_id int4 not null,
	accommodation_id int4 not null,
	user_id int4 not null
)
with (
	oids=false
);

-- P³atnoœci
drop table if exists public.payments cascade;
create table public.payments (
	id serial primary key,
	fee int2 not null,
	entry_id int4 not null,
	user_id int4 not null
)
with (
	oids=false
);

-- Przydzia³ recenzentów do konferencji
drop table if exists public.revs_alloc cascade;
create table public.revs_alloc (
	conference_id int4,
	reviewer_id int4,
	constraint revs_alloc_pkey primary key (conference_id, reviewer_id)
)
with (
	oids=false
);

alter table public.administrators add constraint administrators_user_id_fkey foreign key (user_id) references public.users (id);
alter table public.reviewers add constraint reviewers_user_id_fkey foreign key (user_id) references public.users (id);
alter table public.reviews add constraint reviews_reviewer_id_fkey foreign key (reviewer_id) references public.reviewers (id);
alter table public.reviews add constraint reviews_application_id_fkey foreign key (application_id) references public.applications (id);
alter table public.papers add constraint papers_user_id_fkey foreign key (user_id) references public.users (id);
alter table public.applications add constraint applications_conference_id_fkey foreign key (conference_id) references public.conferences (id);
alter table public.applications add constraint applications_paper_id_fkey foreign key (paper_id) references public.papers (id);
alter table public.applications add constraint applications_uq_conference_id_paper_id unique (conference_id, paper_id);
alter table public.conferences add constraint conferences_administrator_id_fkey foreign key (administrator_id) references public.administrators (id);
alter table public.speeches add constraint speeches_conference_id_fkey foreign key (conference_id) references public.conferences (id);
alter table public.speeches add constraint speeches_paper_id_fkey foreign key (paper_id) references public.papers (id);
alter table public.accommodations add constraint accommodations_conference_id_fkey foreign key (conference_id) references public.conferences (id);
alter table public.entries add constraint entries_conference_id_fkey foreign key (conference_id) references public.conferences (id);
alter table public.entries add constraint entries_accommodation_id_fkey foreign key (accommodation_id) references public.accommodations (id);
alter table public.entries add constraint entries_user_id_fkey foreign key (user_id) references public.users (id);
alter table public.entries add constraint entries_uq_conference_id_user_id unique (conference_id, user_id);
alter table public.entries add constraint entries_uq_accommodation_id_user_id unique (accommodation_id, user_id);
alter table public.payments add constraint payments_entry_id_fkey foreign key (entry_id) references public.entries (id);
alter table public.payments add constraint payments_user_id_fkey foreign key (user_id) references public.users (id);
alter table public.payments add constraint payments_uq_entry_id_user_id unique (entry_id, user_id);
alter table public.revs_alloc add constraint revs_alloc_conference_id_fkey foreign key (conference_id) references public.conferences (id);
alter table public.revs_alloc add constraint revs_alloc_reviewer_id_fkey foreign key (reviewer_id) references public.reviewers (id);