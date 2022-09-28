import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

import ChatBot from './CloneChatBot';

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      gender: '',
      age: '',
    };
  }

  componentWillMount() {
    const { steps } = this.props;
    const { name, gender, age } = steps;

    this.setState({ name, gender, age });
  }

  render() {
    const { name, gender, age } = this.state;
    return (
      <View style={{ width: '100%' }}>
        <Text>Summary</Text>
        <View>
          <View>
            <View>
              <Text>Name</Text>
              <Text>{name.value}</Text>
            </View>
            <View>
              <Text>Gender</Text>
              <Text>{gender.value}</Text>
            </View>
            <View>
              <Text>Age</Text>
              <Text>{age.value}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

Review.propTypes = {
  steps: PropTypes.object,
};

Review.defaultProps = {
  steps: undefined,
};

class SimpleForm extends Component {
  constructor(props) {
    super(props);

  }
  render() {
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
      scrollViewProps={{ contentContainerStyle: this.props.contentStyle }}
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
            message: 'Olá {previousValue}! Qual é o seu sexo?',
            trigger: 'gender',
          },
          {
            id: 'gender',
            options: [
              { value: 'male', label: 'Masculino', trigger: '5' },
              { value: 'female', label: 'Feminino', trigger: '5' },
            ],
          },
          {
            id: '5',
            message: 'Quantos anos você tem?',
            trigger: 'age',
          },
          {
            id: 'age',
            user: true,
            trigger: '7',
            validator: (value) => {
              if (isNaN(value)) {
                return 'value must be a number';
              } else if (value < 0) {
                return 'value must be positive';
              } else if (value > 120) {
                return `${value}? Come on!`;
              }

              return true;
            },
          },
          {
            id: '7',
            message: 'Great! Check out your summary',
            trigger: 'review',
          },
          {
            id: 'review',
            component: <Review />,
            asMessage: true,
            trigger: 'update',
          },
          {
            id: 'update',
            message: 'Would you like to update some field?',
            trigger: 'update-question',
          },
          {
            id: 'update-question',
            options: [
              { value: 'yes', label: 'Yes', trigger: 'update-yes' },
              { value: 'no', label: 'No', trigger: 'end-message' },
            ],
          },
          {
            id: 'update-yes',
            message: 'What field would you like to update?',
            trigger: 'update-fields',
          },
          {
            id: 'update-fields',
            options: [
              { value: 'name', label: 'Name', trigger: 'update-name' },
              { value: 'gender', label: 'Gender', trigger: 'update-gender' },
              { value: 'age', label: 'Age', trigger: 'update-age' },
            ],
          },
          {
            id: 'update-name',
            update: 'name',
            trigger: '7',
          },
          {
            id: 'update-gender',
            update: 'gender',
            trigger: '7',
          },
          {
            id: 'update-age',
            update: 'age',
            trigger: '7',
          },
          {
            id: 'end-message',
            message: 'Thanks! Your data was submitted successfully!',
            end: true,
          },
        ]}
      />
    );
  }
}

export default SimpleForm;