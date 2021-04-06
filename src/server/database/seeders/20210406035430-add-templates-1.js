'use strict'

const createTemplate = ({
  id,
  title,
  description,
  fields = [],
  operations = [],
  constants = [],
  displays = [],
}) => ({
  id,
  title,
  description,
  fields: JSON.stringify(fields),
  constants: JSON.stringify(constants),
  operations: JSON.stringify(operations),
  displays: JSON.stringify(displays),
  createdAt: new Date(),
  updatedAt: new Date(),
})

const covidTempRelief = createTemplate({
  id: 'covid-temp-relief',
  title: 'MLAW COVID Relief Eligibility Check',
  description:
    'About this checker: It asks users to select a bunch of Yes/No questions. Anytime the user answers no then he or she is not eligible for the relief.',
  fields: [
    {
      id: 'R1',
      type: 'RADIO',
      title: 'Choose one of the following',
      description: '',
      options: [
        {
          label:
            'I am / my business is seeking temporary relief under the Act.',
          value: 0,
        },
        {
          label:
            'A part with whom I / my business has an existing contract is seeking temporary relief under the Act against me / my business',
          value: 1,
        },
      ],
    },
    {
      id: 'R2',
      type: 'RADIO',
      title: 'Is the contract a Scheduled Contract?',
      description: '',
      options: [
        { label: 'Yes', value: 0 },
        { label: 'No', value: 1 },
      ],
    },
    {
      id: 'R3',
      type: 'RADIO',
      title: 'Was the contract entered into before 25 March 2020?',
      description: '',
      options: [
        { label: 'Yes', value: 0 },
        { label: 'No', value: 1 },
      ],
    },
    {
      id: 'R4',
      type: 'RADIO',
      title:
        'Are the obligations under the contract, which the party seeking temporary relief against you / your business cannot perform, to be performed on or after 1 February 2020?',
      description: '',
      options: [
        { label: 'Yes', value: 0 },
        { label: 'No', value: 1 },
      ],
    },
    {
      id: 'R5',
      type: 'RADIO',
      title:
        'Is the inability to perform obligation(s) under the contract caused materially by COVID-19?',
      description: '',
      options: [
        { label: 'Yes', value: 0 },
        { label: 'No', value: 1 },
      ],
    },
    {
      id: 'R6',
      type: 'RADIO',
      title:
        'Have you / your business served a Notification for Relief on the other party or parties to the contract?',
      description: '',
      options: [
        { label: 'Yes', value: 0 },
        { label: 'No', value: 1 },
      ],
    },
  ],
  operations: [
    {
      id: 'O1',
      type: 'IFELSE',
      title: 'Eligibility Check for Temporary Relief',
      expression:
        'ifelse(R2 == "No" or (R3 == "No") or (R4 == "No") or (R5 == "No") or (R6 == "No"), "Based on your inputs, it appears that you / your business would NOT qualify for temporary relief under the Act.", "Based on your inputs, it appears that you / your business would qualify for temporary relief under the Act.")',
      show: true,
    },
  ],
})

const quiz = createTemplate({
  id: 'quiz',
  title: 'Quiz',
  description:
    'About this quiz: This is suitable for teachers that want to administer pop quiz for students to conduct self-assessments at home.',
  fields: [
    {
      id: 'N1',
      type: 'NUMERIC',
      title: '5 + 5 = ?',
      description: '',
      options: [],
    },
    {
      id: 'N2',
      type: 'NUMERIC',
      title: '5 x 10 = ?',
      description: '',
      options: [],
    },
    {
      id: 'N3',
      type: 'NUMERIC',
      title: '10 / 5 = ?',
      description: '',
      options: [],
    },
    {
      id: 'N4',
      type: 'NUMERIC',
      title: '10 - 5 = ?',
      description: '',
      options: [],
    },
    {
      id: 'R5',
      type: 'RADIO',
      title: 'What is the name of Fred and George’s joke shop?',
      description: '',
      options: [
        { label: 'Weasley Joke Emporium', value: 0 },
        { label: 'Weasleys’ Wizard Wheezes', value: 1 },
        { label: 'Fred & George’s Wonder Emporium', value: 2 },
        { label: 'Zonko’s Joke Shop', value: 3 },
      ],
    },
    {
      id: 'R6',
      type: 'RADIO',
      title: 'Where does Hermione brew her first batch of Polyjuice Potion?',
      description: '',
      options: [
        { label: 'Moaning Myrtle’s Bathroom', value: 0 },
        { label: 'The Hogwarts Kitchen', value: 1 },
        { label: 'The Room of Requirement', value: 2 },
        { label: 'The Gryffindor Common Room', value: 3 },
      ],
    },
    {
      id: 'R7',
      type: 'RADIO',
      title:
        'What does one say to close the Marauder’s Map and make it blank again?',
      description: '',
      options: [
        { label: 'Mischief Managed', value: 0 },
        { label: 'Nothing to See Here', value: 1 },
        { label: 'All Done', value: 2 },
        { label: 'Hello Professor', value: 3 },
      ],
    },
  ],
  operations: [
    {
      id: 'O1',
      type: 'IFELSE',
      title: 'Question 1 Answer',
      expression: 'ifelse(N1 == 10, "correct", "incorrect")',
      show: true,
    },
    {
      id: 'O2',
      type: 'IFELSE',
      title: 'Question 2 Answer',
      expression: 'ifelse(N2 == 50, "correct", "incorrect")',
      show: true,
    },
    {
      id: 'O3',
      type: 'IFELSE',
      title: 'Question 3 Answer',
      expression: 'ifelse(N3 == 2, "correct", "incorrect")',
      show: true,
    },
    {
      id: 'O4',
      type: 'IFELSE',
      title: 'Question 4 Answer',
      expression: 'ifelse(N4 == 5, "correct", "incorrect")',
      show: true,
    },
    {
      id: 'O5',
      type: 'IFELSE',
      title: 'Question 5 Answer',
      expression:
        'ifelse(R5 == "Weasley Joke Emporium", "correct", "incorrect")',
      show: true,
    },
    {
      id: 'O6',
      type: 'IFELSE',
      title: 'Question 6 Answer',
      expression:
        'ifelse(R6 == "Moaning Myrtle’s Bathroom", "correct", "incorrect")',
      show: true,
    },
    {
      id: 'O7',
      type: 'IFELSE',
      title: 'Question 7 Answer',
      expression: 'ifelse(R7 == "Mischief Managed", "correct", "incorrect")',
      show: true,
    },
    {
      id: 'O8',
      type: 'ARITHMETIC',
      title: 'Count # of Correct',
      expression: 'countif([O1,O2,O3,O4,O5,O6,O7],"correct")',
      show: false,
    },
    {
      id: 'O9',
      type: 'ARITHMETIC',
      title: 'Score',
      expression: '(O8*100)/7',
      show: true,
    },
  ],
})

const importDuties = createTemplate({
  id: 'import-duties',
  title: 'Import Duties Calculator',
  description:
    'About this checker: This checker makes use of a mapping table where each type of alcohol is mapped to a different fees. Based on the volume of the alcohol specified, the import duties is computed at the end by multiplying the fee, volume and the alcohol percentage content.',
  fields: [
    {
      id: 'R1',
      type: 'RADIO',
      title: 'What type of alcohol are you importing?',
      description: '',
      options: [
        { label: 'Stout', value: 0 },
        { label: 'Whiskies', value: 1 },
      ],
    },
    {
      id: 'N2',
      type: 'NUMERIC',
      title: 'What is the quantity (in litres) of this alcohol?',
      description: '',
      options: [],
    },
    {
      id: 'N3',
      type: 'NUMERIC',
      title: 'What is the percentage strength of this alcohol?',
      description: '',
      options: [],
    },
  ],
  constants: [
    {
      id: 'T1',
      title: 'Duties rates',
      table: [
        { key: 'Stout', value: 60 },
        { key: 'Whiskies', value: 88 },
      ],
    },
  ],
  operations: [
    {
      id: 'O1',
      type: 'MAP',
      title: 'Duties rate',
      expression: 'T1[R1]',
      show: true,
    },
    {
      id: 'O2',
      type: 'ARITHMETIC',
      title: 'Duties payable',
      expression: 'O1*N2*(N3/100)',
      show: true,
    },
  ],
})

const shn = createTemplate({
  id: 'shn-calculator',
  title: 'SHN Calculator',
  description:
    'About this checker: it helps user calculate date to leave based on the date input by the user.',
  fields: [
    {
      id: 'D1',
      type: 'DATE',
      title: 'Please select your SHN start date:',
      description:
        'SHN Start Date would be the date you cleared arrival immigration in Singapore.',
      options: [],
    },
  ],
  operations: [
    {
      id: 'O1',
      type: 'DATE',
      title: 'Estimated 14-Day SHN end date:',
      expression: 'D1 + 14 days',
      show: true,
    },
  ],
})

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('templates', [
      covidTempRelief,
      quiz,
      importDuties,
      shn,
    ])
  },

  down: async (queryInterface) => {
    queryInterface.bulkDelete('templates', {
      id: [covidTempRelief.id, quiz.id, importDuties.id, shn.id],
    })
  },
}
