import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import ChatBot from './Chatbot';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const Review = (props) => {
    const [{ name, gender, age }, setState] = React.useState({
        name: '',
        gender: '',
        age: '',
    });

  React.useEffect(() => {
      setState(props.steps);
  }, [])

    return (
      <View style={{ width: '100%' }}>
        <Text>Summary</Text>
        <View>
          <View>
            <View>
              <Text>Name</Text>
              {/* <Text>{name?.value}</Text> */}
            </View>
            <View>
              <Text>Gender</Text>
              {/* <Text>{gender?.value}</Text> */}
            </View>
            <View>
              <Text>Age</Text>
              {/* <Text>{age?.value}</Text> */}
            </View>
          </View>
        </View>
      </View>
    );
}

const SimpleForm = () => {
    const height = useHeaderHeight();

    const LoadingAwait = React.useCallback(props => {
      React.useEffect(() => {
        setTimeout(() => {
          props.triggerNextStep();
        }, 3000);
      }, [])

      return null
    }, [])

    return (
      <ChatBot hideBotAvatar hideHeader hideUserAvatar 
      userFontColor={"black"} userBubbleColor={"white"}
      optionFontColor={"black"} optionBubbleColor={"white"}
      botFontColor={"white"} botBubbleColor={"#272527"} bubbleStyle={{ padding: 10 }}
      footerStyle={{ backgroundColor: '#242124', borderTop: 0 }}
      inputStyle={{ backgroundColor: 'rgba(0,0,0,.2)', color: 'white' }}
      submitButtonStyle={{ backgroundColor: 'rgba(0,0,0,.3)'}}
      submitButtonContent={"Enviar"}
      placeholder={"Digite aqui..."}
      scrollViewProps={{ 
        contentContainerStyle: {
          paddingTop: height || STATUSBAR_HEIGHT,
          paddingBottom: 0 || STATUSBAR_HEIGHT,
          flexGrow: 1
        }
      }}
      contentStyle={{ backgroundColor: 'black', borderBottom: 0 }}
      keyboardVerticalOffset={0}
        steps={[
          {
            id: '0',
            message: "Olá!😄",
            trigger: 'wellcome'
          },
          {
            id: 'wellcome',
            message: "Que bom ver você aqui",
            trigger: '1'
          },
          {
            id: '1',
            message: 'Qual é o seu nome?',
            trigger: 'name',
          },
          {
            id: 'name',
            user: true,
            trigger: '3',
          },
          {
            id: '3',
            message: 'Olá {previousValue}! Qual é o tipo de produto que deseja contratar?',
            trigger: 'product',
          },
          {
            id: 'product',
            options: [
              { value: 'analize', label: 'Analise de Crédito', trigger: 'email-quest' },
              { value: 'procedencia', label: 'Procedência Veicular', trigger: 'email-quest' },
            ],
          },
          {
            id: 'email-quest',
            message: 'Qual é o seu email?',
            trigger: 'email',
          },
          {
            id: 'email',
            user: true,
            trigger: 'cell-quest',
            inputAttributes: {
              textContentType: "emailAddress",
              keyboardType: "email-address",
            },
            validator: (value) => {
              if (!(/\S+@\S+\.\S+/).test(value)) {
                return 'formato de email invalido.';
              } 
              return true;
            },
          },
          {
            id: 'cell-quest',
            message: 'Qual é o seu número de celular?',
            trigger: 'cell',
          },
          {
            id: 'cell',
            user: true,
            trigger: 'phone-require-quest',
            inputAttributes: {
              textContentType: "telephoneNumber",
              keyboardType: "numeric",
              type: 'cel-phone',
              options: {
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }
            },
            validator: (value) => {
              if (value.match(/\d/g).length!==11) {
                return 'telefone celular invalido.';
              } 
              return true;
            },
          },
          {
            id: 'phone-require-quest',
            message: 'Deseja informar o seu telefone?',
            trigger: 'phone-require',
          },
          {
            id: 'phone-require',
            options: [
              { value: 'ok', label: 'Sim', trigger: 'phone-quest' },
              { value: 'not', label: 'Não', trigger: 'ceep-quest' },
            ],
          },
          {
            id: 'phone-quest',
            message: 'Qual é o seu número de telefone?',
            trigger: 'phone',
          },
          {
            id: 'phone',
            user: true,
            trigger: 'ceep-quest',
            inputAttributes: {
              textContentType: "telephoneNumber",
              keyboardType: "numeric",
              type: 'cel-phone',
              options: {
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }
            },
            validator: (value) => {
              if (value?.match(/\d/g).length!==10) {
                return 'Formato de telefone invalido.';
              } 
              return true;
            },
          },
          {
            id: 'socialReason-quest',
            message: 'Informe a sua Razão Social',
            trigger: 'socialReason',
          },
          {
            id: 'socialReason',
            user: true,
            trigger: 'fantasyName-quest',
          },

          {
            id: 'fantasyName-quest',
            message: 'Informe o Nome Fantasia',
            trigger: 'socialReason',
          },
          {
            id: 'fantasyName',
            user: true,
            trigger: 'cnpj-quest',
          },

          {
            id: 'cnpj-quest',
            message: 'Informe o CNPJ',
            trigger: 'cnpj',
          },
          {
            id: 'cnpj',
            user: true,
            trigger: 'ceep-quest',
          },

          {
            id: 'ceep-quest',
            message: 'Informe o CEEP',
            trigger: 'ceep',
          },
          {
            id: 'ceep',
            user: true,
            trigger: ({ value, steps }) => '7',
            inputAttributes: {
              textContentType: "postalCode",
              keyboardType: "numeric",
              type: 'zip-code',
            },
            validator:  (value) => {
              // "09341-450" testa com traço
              if (!(/[0-9]{5}-[0-9]{3}/g).test(value)) {
                return 'Formato de ceep invalido.';
              } 
              return true;
            },
          },
          {
            id: '7',
            waitAction: true, metadata: { hide: true },
            component: <LoadingAwait />,
            trigger: '8',
          },
          {
            id: '8',
            message: 'Finaliza',
            // trigger: 'review',
            end: true,
          },
          // {
          //   id: 'review',
          //   component: <Review />,
          //   asMessage: true,
          //   trigger: 'update',
          // },
          // {
          //   id: 'update',
          //   message: 'Would you like to update some field?',
          //   trigger: 'update-question',
          // },
          // {
          //   id: 'update-question',
          //   options: [
          //     { value: 'yes', label: 'Yes', trigger: 'update-yes' },
          //     { value: 'no', label: 'No', trigger: 'end-message' },
          //   ],
          // },
          // {
          //   id: 'update-yes',
          //   message: 'What field would you like to update?',
          //   trigger: 'update-fields',
          // },
          // {
          //   id: 'update-fields',
          //   options: [
          //     { value: 'name', label: 'Name', trigger: 'update-name' },
          //     { value: 'gender', label: 'Gender', trigger: 'update-gender' },
          //     { value: 'age', label: 'Age', trigger: 'update-age' },
          //   ],
          // },
          // {
          //   id: 'update-name',
          //   update: 'name',
          //   trigger: '7',
          // },
          // {
          //   id: 'update-gender',
          //   update: 'gender',
          //   trigger: '7',
          // },
          // {
          //   id: 'update-age',
          //   update: 'age',
          //   trigger: '7',
          // },
          // {
          //   id: 'end-message',
          //   message: 'Thanks! Your data was submitted successfully!',
          //   end: true,
          // },
        ]}

      />
    );
}

export default SimpleForm;





