import PropTypes from 'prop-types'
import { useState, useRef } from 'react'
import './App.css'

// form element component
function Output({ label, dropDown, name, type, step, testId, onChange}) {
  // creates labels for each element sent
  const createLabel = (
    <label htmlFor={ testId } className='label' placeholder='0'>
      { label }
    </label>
  );

  // checks for dropDown value if one needs to be created
  if (dropDown) {
    const drop = dropDown.map((option) => <option key={ option }>{ option }</option>);

    return (
      <div className='input-group'>
        { createLabel }
        <div className='input'>
          <select 
            className='dropdown' 
            data-testid={ testId } 
            id={ testId }
            onChange={ onChange }
          >
            { drop }
          </select>
        </div>
      </div>
    )
  }

  // standard userInput module. If a step value is not given it defaults to undefined
  let userInput = 
    <input 
      className='input-area' 
      name={ name } 
      type={ type } 
      data-testid={ testId } 
      id={ testId }
      step={ step || undefined} 
      onChange={ onChange }
    />

  return (
    <div className='input-group'>
      { createLabel }
      <div className='input'>
        { userInput }
      </div>
    </div>
  );
}

// prop verification
Output.propTypes = {
  label: PropTypes.string.isRequired,
  dropDown: PropTypes.arrayOf(PropTypes.number),
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  step: PropTypes.string,
  testId: PropTypes.string,
  onChange: PropTypes.func,
};

// meat and potatos
function App() {
  // array of term options
  const termOpt = [15, 30];
  // reference for output <div>
  const outputRef = useRef(null);

  // state handlers
  const [balance, setBalance] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState(termOpt[0]);


  const handleBalance = (input) => {
    setBalance(input.target.value);
  }

  const handleRate = (input) => {
    setRate(input.target.value);
  }

  const handleTerm = (change) => {
    setTerm(change.target.value);
  }

  // submit section to display calculated monthly payment
  const handleSubmit = (click) => {
    // prevents the web page from auto refreshing after form submission
    click.preventDefault();

    // properly parse input values
    const balanceNum = parseFloat(balance);
    const rateNum = parseFloat(rate) / 100;
    const termNum = parseInt(term, 10);

    // if any option is not a number
    if (isNaN(balanceNum) || isNaN(rateNum) || isNaN(termNum)) {
      outputRef.current.textContent = 'Please provide valid inputs.';
      return;
    }

    const months = termNum * 12;
    const monthlyInt = rateNum / 12;
    const top = monthlyInt * Math.pow(1 + monthlyInt, months);
    const bottom = Math.pow(1 + monthlyInt, months) - 1;
    const monthlyPayment = balanceNum * (top / bottom);

    // sends monthly payment to the referenced output with proper format for change
    outputRef.current.textContent = `$${monthlyPayment.toFixed(2)} is your payment.`
  }

  return (
    <div>
      <h1 className='title'>Mortgage Calculator</h1>
      <form className='form-group' onSubmit={ handleSubmit } >
        <Output label={ 'Loan Amount' } name='balance' type='number' testId='balance' onChange={ handleBalance }/>
        <Output label={ 'Interest Rate (%)' } name='rate' type='number' step='0.01' testId='rate' onChange={ handleRate }/>
        <Output label={ 'Loan Term (years)' } name='term' dropDown={ termOpt } testId='term' onChange={ handleTerm }/>
        <div className="button-area">
          <button className='button' name='submit' data-testid='submit'>Calculate</button>
        </div>
      </form>
      <div className='display' id='output' data-testid='output' ref={ outputRef }/>
    </div>
  )
}

export default App
