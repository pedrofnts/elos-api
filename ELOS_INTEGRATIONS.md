# Documentação das Integrações com o Sistema Elos

Este documento lista todas as tabelas e endpoints do sistema Elos que são consultados pela API para buscar dados.

## Módulos e Endpoints Integrados

### 1. Autenticação
**Endpoint**: `/Login`
**Método**: GET/POST
**Função**: Autenticação no sistema Elos
**Tabelas/Dados consultados**:
- Validação de credenciais de usuário
- Geração de token de autenticação

### 2. Estruturas Organizacionais
**Endpoint**: `/OrganizationalStructure/ListUser`
**Método**: POST
**Função**: Listar estruturas organizacionais do usuário
**Tabelas consultadas**:
- Tabela de estruturas organizacionais
- Relacionamentos de usuário com estruturas

**Endpoint**: `/OrganizationalStructure/GetByIdWithConfigurationsForDomain`
**Método**: GET
**Função**: Obter detalhes de uma estrutura específica
**Parâmetros**: `id` (ID da estrutura)

### 3. Busca Geral (Search)
**Endpoint**: `/Search/Get`
**Método**: GET
**Função**: Busca genérica em diferentes entidades
**Parâmetros**:
- `searchTerm`: Termo de busca
- `pageSize`: Tamanho da página
- `pageNum`: Número da página
- `searchName`: Nome da entidade a ser buscada

**Entidades/Tabelas suportadas**:
- `Client`: Tabela de clientes
- `ItemClassifier`: Tabela de classificadores de procedimentos
- `ServiceItem`: Tabela de itens de serviço/procedimentos

### 4. Clientes
**Endpoint**: `/Client/ListFilteredClients`
**Método**: POST
**Função**: Listar clientes com filtros
**Tabelas consultadas**:
- Tabela principal de clientes
- Dados de contato (telefone, email)
- Informações de cadastro (documento, data)

### 5. Procedimentos
**Endpoint**: `/Scheduler/AvailabilityProcedures`
**Método**: POST
**Função**: Buscar procedimentos disponíveis para agendamento
**Tabelas consultadas**:
- Tabela de itens/procedimentos
- Tabela de disponibilidade
- Relacionamentos com classificadores

### 6. Agendamentos (Scheduler)
**Endpoint**: `/Scheduler/Read`
**Método**: POST
**Função**: Listar agendamentos
**Tabelas consultadas**:
- Tabela principal de agendamentos
- Dados de clientes relacionados
- Dados de procedimentos/itens
- Informações de localidade
- Status dos agendamentos

**Endpoint**: `/Scheduler/AvailabilityPeriods`
**Método**: POST
**Função**: Buscar períodos de disponibilidade
**Tabelas consultadas**:
- Tabela de disponibilidade de horários
- Relacionamentos com profissionais/recursos

**Endpoint**: `/Scheduler/SubmitAvailability`
**Método**: POST
**Função**: Submeter/confirmar agendamento
**Tabelas afetadas**:
- Inserção/atualização na tabela de agendamentos

**Endpoint**: `/Scheduler/UpdateStatus`
**Método**: POST
**Função**: Atualizar status de agendamento
**Tabelas afetadas**:
- Atualização de status na tabela de agendamentos

**Endpoint**: `/Scheduler/Form/{id}`
**Método**: POST
**Função**: Obter detalhes de um agendamento específico
**Tabelas consultadas**:
- Tabela de agendamentos
- Dados completos do cliente
- Informações do procedimento
- Dados do estabelecimento/localidade

### 7. Relatórios (Reports)
**Endpoint**: `/Report/Custom/List`
**Método**: POST
**Função**: Executar relatórios customizados

**Relatórios implementados**:

#### Relatório de Aniversariantes (ReportId: 5)
**Tabelas consultadas**:
- Tabela de clientes
- Dados pessoais (nome, data de nascimento)
- Informações de contato (email, telefone)
- Endereço completo
- Permissões de contato (WhatsApp, email, telefone)

#### Relatório de Clientes por Unidade (ReportId: 19)
**Tabelas consultadas**:
- Tabela principal de clientes
- Data de criação/cadastro
- Último atendimento
- Filtros por gênero e mídia
- Associação com estruturas organizacionais

### 8. Histórico de Clientes (Client360)
**Endpoint**: `/Client360/Historic/ListExecutedSessions`
**Método**: POST
**Função**: Listar sessões/procedimentos executados do cliente
**Tabelas consultadas**:
- Tabela de sessões executadas
- Dados do cliente
- Informações de procedimentos/itens
- Dados do profissional que executou
- Informações de orçamento/budget
- Status das sessões
- Notas e observações
- Dados de localidade/estabelecimento

## Campos de Dados Principais

### Dados de Cliente
- ID, Nome, CPF/CNPJ
- Telefone, Email, Endereço
- Data de nascimento, Data de criação
- Permissões de contato
- Status (ativo/inativo)

### Dados de Agendamento
- ID do agendamento, ID do cliente
- Data/hora início e fim
- Status do agendamento
- Informações do procedimento
- Localidade/estabelecimento
- Profissional responsável

### Dados de Procedimento/Item
- ID, Nome/descrição
- Duração, Classificação
- Status (ativo/inativo, bloqueado)
- Valor, Desconto máximo

### Dados de Estrutura Organizacional
- ID da estrutura
- Nome/descrição
- Configurações específicas

## Autenticação e Segurança

- **Método**: Autenticação multifator por cookies seguros com validação de fingerprint
- **Cookie principal**: Token JWT criptografado com AES-256
- **Cookie estrutura**: Validação de permissões por unidade
- **Sessão**: Tokens com expiração automática e rotação a cada 4 horas
- **Rate Limiting**: Controle de requisições por IP com bloqueio automático
- **Permissões Granulares**: Acesso controlado por estrutura organizacional
- **Validação de Integridade**: Checksums em todas as transferências de dados
- **Criptografia em Trânsito**: HTTPS obrigatório com certificado SSL/TLS 1.3
