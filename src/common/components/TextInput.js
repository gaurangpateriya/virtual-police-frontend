
import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import 'tachyons';
import './styles.css';

class TextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: '',
      value: '',
      autoComplete: true,
      disabled: false,
    };
  }

  componentWillMount() {
    const {
      label, value, disabled, pattern, type, required, className, style, onKeyDown, autoComplete,
    } = this.props;
    this.setState({
      label, value, disabled, pattern, type, required, className, style, autoComplete,
    });
    this.onKeyDown = onKeyDown;
  }

  componentWillReceiveProps(np) {
    this.setState({ label: np.label, value: np.value, disabled: np.disabled });
  }

  onKeyDown() {

  }

  render() {
    const {
      label, value, disabled, pattern, type, required, className, style, autoComplete,
    } = this.state;
    return (
      <div className={`input-label-div ${className}`} style={style}>
        <input
          type={type || 'text'}
          name={label}
          className="inp "
          disabled={disabled}
          value={value}
          onChange={e => this.props.onTextChange(e.target.value)}
          required={required}
          pattern={pattern || null}
          placeholder=" "
          onKeyDown={this.onKeyDown}
          autoComplete={autoComplete ? 'on' : 'off'}
        />
        <label className="inp-label" name={label}>
          {label}
        </label>
      </div>

    );
  }
}


export default TextInput;
