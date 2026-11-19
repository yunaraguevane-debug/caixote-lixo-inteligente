# CLI – Caixote do Lixo Inteligente

**Monitorização do nível de enchimento e da qualidade do ar**

## 1. Autoras

- Tifany Parbhudas
- Yunara Guevane

## 2. Versão

- Versão: 1.0 – Em desenvolvimento
- Estado: Protótipo em desenvolvimento.

## 3. Descrição do Projeto

O Caixote do Lixo Inteligente (CLI) é um projeto que pretende desenvolver um sistema capaz de monitorizar o nível de enchimento e a qualidade do ar no interior de um caixote do lixo.

O sistema utiliza um sensor ultrassónico HC-SR04 para medir o nível de enchimento e um sensor de gás MQ-2 para monitorizar a qualidade do ar.

As informações recolhidas serão apresentadas num ecrã LCD e através de indicadores luminosos RGB e de um buzzer, que permitirá alertar quando forem detetadas situações anormais.

O projeto prevê ainda uma página web com um gráfico em tempo real, permitindo acompanhar o estado do caixote através de uma ligação Wi-Fi.

## 4. Materiais e Componentes

- ESP32 – placa de desenvolvimento.
- HC-SR04 – sensor ultrassónico.
- MQ-2 – sensor de gás.
- LCD 1602 com adaptador I2C.
- LED RGB de cátodo comum.
- Buzzer ativo.
- Breadboard.
- Fios de ligação (jumpers).
- 3 resistências de 220 Ω.
- 2 resistências de 1 kΩ.
- 2 resistências de 2 kΩ.
- Caixote do lixo para o protótipo.

## 5. Ferramentas e Tecnologias

- Arduino IDE – programação do ESP32.
- C/C++ – desenvolvimento do código.
- HTML – estrutura da página web.
- CSS – apresentação visual da página.
- JavaScript – atualização e apresentação dos dados.
- Wi-Fi – comunicação sem fios.
- Git e GitHub – controlo de versões e partilha do código.

## 6. Instalação e Configuração

Para desenvolver e executar o projeto, serão necessários:

1. Instalar o Arduino IDE.
2. Instalar o suporte para placas ESP32 no Arduino IDE.
3. Instalar as bibliotecas necessárias para os componentes utilizados.
4. Ligar os sensores e os restantes componentes ao ESP32.
5. Configurar as ligações e os parâmetros dos componentes no código.

As bibliotecas específicas serão identificadas e documentadas à medida que o desenvolvimento avançar.

## 7. Instruções de Execução

1. Ligar o ESP32 ao computador através de um cabo USB.
2. Abrir o código do projeto no Arduino IDE.
3. Selecionar a placa ESP32 e a porta de comunicação correta.
4. Verificar e compilar o código.
5. Carregar o programa para o ESP32.
6. Verificar o funcionamento dos sensores e dos dispositivos de saída.

A página web será disponibilizada através do servidor configurado no ESP32, após a implementação da comunicação Wi-Fi.

## 8. Modos de Funcionamento

O sistema deverá apresentar três estados principais:

- **Normal:** nível de enchimento inferior a 70% e qualidade do ar dentro dos limites definidos.
- **Aviso:** nível de enchimento igual ou superior a 70%.
- **Alerta:** nível de enchimento igual ou superior a 90% ou deteção de gás acima do limite definido.

Os estados serão indicados através do LCD e do LED RGB. No estado de alerta, o buzzer deverá emitir um sinal sonoro.

A página web permitirá acompanhar os dados recolhidos em tempo real.

## 9. Parâmetros do Sistema

| Parâmetro | Descrição |
|---|---|
| Nível de enchimento | Percentagem de ocupação do caixote (0–100%). |
| Limite de aviso | 70% de enchimento. |
| Limite de alerta | 90% de enchimento. |
| Qualidade do ar | Valor medido pelo sensor MQ-2. |
| Limite de gás | Valor de referência a definir durante a calibração. |
| Comunicação | Ligação Wi-Fi através do ESP32. |

## 10. Estado Atual do Desenvolvimento

- Circuito montado na breadboard.
- Sensor MQ-2 testado com sucesso.
- Sensor ultrassónico HC-SR04 já disponível.
- Ligação do LCD em desenvolvimento.
- Integração dos componentes e página web por desenvolver.

## 11. Autoria e Contribuições

O projeto é desenvolvido em colaboração por Tifany Parbhudas e Yunara Guevane.

O código e a documentação serão atualizados regularmente no repositório GitHub.
