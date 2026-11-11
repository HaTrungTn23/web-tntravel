alter table public.chatbot_documents
  drop constraint if exists chatbot_documents_source_type_check;

alter table public.chatbot_documents
  add constraint chatbot_documents_source_type_check
  check (source_type in ('destination','journey','product','region','station','event'));
