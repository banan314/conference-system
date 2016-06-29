-- Wypisanie danych administratorow
select u.first_name, u.last_name 
from public.users u, public.administrators a 
where u.id = a.user_id;

-- Wypisanie konferencji obslugiwacnych przez administratora nr 1
select c.topic, c.conf_datetime, c.location 
from public.conferences c 
where c.administrator_id = 1;

-- Wypisanie zakwaterowan dla konferencji nr 3
select a.location, a.fee 
from accommodations a 
where a.conference_id = 3;

-- Wypisanie referatow wraz z ich recenzja
select p.topic, s.duration_in_min, r.opinion, r.topic_rate, r.content_rate, r.decision 
from papers p, speeches s, reviews r, applications a 
where a.paper_id = p.id 
	and a.id = r.application_id 
	and p.id = s.paper_id;

-- Wypisanie danych recenzentow oraz ich recenzji
select u.first_name, u.last_name, r.opinion 
from users u, reviews r, reviewers re 
where re.user_id = u.id 
	and r.reviewer_id = re.id;

-- Wyswietlenie ilosci wejsciowek jaka kupil dany uzytkownik
select  u.first_name || ' ' || u.last_name, count(*) as "Ilosc wejsciowek" 
from users u, payments p 
where u.id = p.user_id
group by p.user_id, u.first_name, u.last_name;