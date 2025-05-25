# Documentação do Projeto – Aplicativo: Diabeta

**Curso:** Análise e Desenvolvimento de Sistemas (5º semestre)

**Equipe:**

Julia Lisandra Furuguem de Souza
Lucas Loiola Bezerra
Rafael Andrade
David José Correa de Souza

**Metodologia:** Ágil (Scrum ou Kanban)

### **Descrição do Projeto**

O Diabeta é um aplicativo mobile desenvolvido em React Native para auxiliar pessoas com diabetes no controle diário da glicemia e alimentação. O sistema também integra uma solução de IoT, composta por uma almofada inteligente equipada com sensor de pressão e ESP8266. Essa almofada monitora o tempo de inatividade do usuário e envia alertas para incentivar hábitos saudáveis.

### **Objetivo**

Fornecer uma ferramenta prática e tecnológica que auxilie pessoas com diabetes a:

- Registrar glicemia e refeições.
- Receber alertas personalizados para evitar o sedentarismo.
- Manter o histórico dos dados de saúde para acompanhamento contínuo.

### **Público-Alvo**

Pessoas com diabetes

Cuidadores e familiares de diabéticos

Clínicas e profissionais da saúde interessados em acompanhar hábitos de pacientes.

### **Funcionalidades**

**Funcionalidades Principais**

- Registro de medições de glicemia
- Cadastro e busca de alimentos via API própria
- Histórico completo de glicemias e refeições
- Notificações automáticas baseadas em tempo de inatividade detectado pela almofada IoT
- Interface simples, acessível e funcional

**Funcionalidades Extras**

- Integração com API de Alimentos: Busca em base própria (MongoDB), trazendo informações como nome, tipo e calorias, facilitando o registro preciso das refeições
- Histórico cronológico unificado: Registros de glicemia e refeições em ordem, auxiliando a identificação de padrões
- Exportação de relatórios em PDF: Geração de relatórios completos para acompanhamento médico

### **Requisitos**

**Requisitos Funcionais**

- O usuário deve conseguir registrar uma medição de glicemia.
- O usuário pode cadastrar refeições buscando alimentos via API.
- O app deve exibir o histórico de glicemia e refeições.
- O sistema deve receber notificações do sensor IoT (ESP8266) indicando tempo de inatividade.

**Requisitos Não Funcionais**

- Comunicação entre o app e a API deve ocorrer em até 2 segundos em condições normais de rede.
- O app depende de conexão com a internet; não há funcionalidade offline.
- Interface deve ser intuitiva e acessível para diferentes perfis de usuários.
- Estrutura de dados no MongoDB deve garantir consistência, integridade e segurança.
- Compatível com dispositivos Android.

### **Tecnologias Utilizadas**

- **Frontend:** React Native (Expo Router), AsyncStorage, Axios
- **Backend:** Node.js, Express
- **Banco de Dados:** MongoDB Atlas
- **API de Alimentos:** Node.js + MongoDB
- **IoT:** ESP8266, Sensor de Pressão (conexão Wi-Fi)
- **Testes:** Pytest (unitários), Katalon Studio (usabilidade), BlazeMeter (performance)
- **DevOps:** GitHub Actions (CI/CD)

### **Arquitetura e Fluxo de Dados**

[Usuário] ⇄ [App React Native]
       ⇅                    ⇅
[API de Alimentos]     [API Backend (Express)]
       ⇅
 [MongoDB Atlas]
      ↑
[ESP8266 + Sensor]
(via Wi-Fi HTTP request)

- 
- O app envia e recebe dados das APIs.
- A almofada inteligente envia notificações de sedentarismo para o app.
- O MongoDB armazena dados de glicemia/alimentação.

### **Plano de Testes**

- **Testes Unitários:** Pytest, focando nas funções básicas do app e integração com API.
- **Testes de Usabilidade:** Katalon Studio, simulando navegação e ações do usuário.
- **Testes de Performance:** BlazeMeter, testando tempo de resposta e carga das APIs.
- **Automação:** Scripts CI/CD no GitHub Actions para execução automática dos testes e geração de relatórios.
