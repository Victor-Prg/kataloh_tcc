import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeSlash } from 'phosphor-react';
import { useTheme } from '../../composables/useTheme';
import type { PaletteName } from '../../composables/ThemeContext';
import LogoSvg from '../../assets/logo.svg';

const inputBase =
  'mt-2 block w-full rounded-md bg-[var(--bg-input)] px-3 py-1.5 text-base text-[var(--text-primary)] ring-1 ring-[var(--border-color)] placeholder:text-[var(--text-soft)] focus:ring-2 focus:ring-[var(--primary-100)]';

const inputBaseDisabledExtras =
  'disabled:bg-[var(--bg-hover)] disabled:text-[var(--text-soft)]';

const inputPasswordBase =
  'block w-full rounded-md bg-[var(--bg-input)] px-3 py-1.5 text-base text-[var(--text-primary)] placeholder:text-[var(--text-soft)] focus:outline-none';

const errorText = 'mt-1 text-xs text-[var(--danger)]';

const namePattern = /^[A-Za-zÀ-ÿ\s]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

const validateName = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return '';
  if (trimmed.length < 3) return 'Informe seu nome completo';
  return namePattern.test(trimmed) ? '' : 'Use apenas letras no nome';
};

const validateEmail = (value: string) => {
  if (value.length === 0) return '';
  return emailPattern.test(value) ? '' : 'Informe um e-mail válido';
};

const validatePassword = (value: string) => {
  if (value.length === 0) return '';
  return strongPasswordPattern.test(value)
    ? ''
    : 'A senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula e um número';
};

const isEmpty = (value: string) => value.trim().length === 0;

export default function Register() {
  const { setPalette, isDark, toggleTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [noNumber, setNoNumber] = useState(false);
  const [addressNumber, setAddressNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [streetTouched, setStreetTouched] = useState(false);
  const [districtTouched, setDistrictTouched] = useState(false);
  const [cityTouched, setCityTouched] = useState(false);
  const [addressStateTouched, setAddressStateTouched] = useState(false);
  const [addressNumberTouched, setAddressNumberTouched] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const nameRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
  const streetRef = useRef<HTMLInputElement | null>(null);
  const addressNumberRef = useRef<HTMLInputElement | null>(null);
  const districtRef = useRef<HTMLInputElement | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const addressStateRef = useRef<HTMLInputElement | null>(null);
  const termsRef = useRef<HTMLInputElement | null>(null);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length === 0) {
      setPhone('');
      return;
    }

    if (digits.length <= 2) {
      setPhone(`(${digits}`);
      return;
    }

    if (digits.length <= 6) {
      setPhone(digits.replace(/^(\d{2})(\d{0,4})/, '($1) $2'));
      return;
    }

    setPhone(digits.replace(/^(\d{2})(\d{0,5})(\d{0,4})/, '($1) $2-$3'));
  };

  useEffect(() => {
    setPalette('Kataloh' as PaletteName);
  }, [setPalette]);

  const lightBg =
    'radial-gradient(120% 90% at 30% 35%, #8CB800 0%, #A3D900 30%, #F4FBE5 65%, #F8FAFC 100%)';
  const darkBg =
    'radial-gradient(120% 90% at 70% 30%, #B8F000 0%, #A3D900 32%, #1D2025 65%, #0A0C0E 100%)';

  const backgroundImage = isDark ? darkBg : lightBg;

  const phoneDigits = phone.replace(/\D/g, '');
  const isDistrictValid =
    !isEmpty(district) && namePattern.test(district.trim());
  const isCityValid =
    !isEmpty(city) && namePattern.test(city.trim());

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const isStep1Valid =
    !isEmpty(name) &&
    !nameError &&
    phoneDigits.length === 11 &&
    !isEmpty(email) &&
    !emailError &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    !passwordError &&
    !passwordMismatch;

  const isStep2Valid =
    street.trim().length > 0 &&
    isDistrictValid &&
    isCityValid &&
    addressState.trim().length === 2 &&
    (noNumber || addressNumber.trim().length > 0) &&
    termsAccepted;

  const focusFirstStep1Error = () => {
    if (isEmpty(name) || nameError) {
      nameRef.current?.focus();
      return;
    }
    if (phoneDigits.length !== 11) {
      phoneRef.current?.focus();
      return;
    }
    if (isEmpty(email) || emailError) {
      emailRef.current?.focus();
      return;
    }
    if (password.length === 0 || passwordError) {
      passwordRef.current?.focus();
      return;
    }
    if (confirmPassword.length === 0 || passwordMismatch) {
      confirmPasswordRef.current?.focus();
    }
  };

  const focusFirstStep2Error = () => {
    if (isEmpty(street)) {
      streetRef.current?.focus();
      return;
    }
    if (!noNumber && isEmpty(addressNumber)) {
      addressNumberRef.current?.focus();
      return;
    }
    if (!isDistrictValid) {
      districtRef.current?.focus();
      return;
    }
    if (!isCityValid) {
      cityRef.current?.focus();
      return;
    }
    if (addressState.trim().length !== 2) {
      addressStateRef.current?.focus();
      return;
    }
    if (!termsAccepted) {
      termsRef.current?.focus();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError('');
    setSubmitSuccess('');

    if (!isStep2Valid) {
      setStreetTouched(true);
      setDistrictTouched(true);
      setCityTouched(true);
      setAddressStateTouched(true);
      setAddressNumberTouched(true);
      setTermsTouched(true);
      focusFirstStep2Error();
      setSubmitError('Preencha todos os campos obrigatórios antes de continuar');
      return;
    }

    setIsSubmitting(true);
    setIsSubmitting(false);
    setSubmitSuccess('Conta criada com sucesso!');
  };

  const handleGoToStep2 = () => {
    if (!isStep1Valid) {
      setNameTouched(true);
      setPhoneTouched(true);
      focusFirstStep1Error();
      return;
    }

    setStep(2);
  };

  return (
    <>
      <div
        className="flex min-h-screen flex-col justify-center px-4 py-12 sm:px-6 lg:px-8"
        style={{
          backgroundImage,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="relative rounded-2xl px-6 py-12 shadow-sm ring-1 ring-[var(--border-color)] bg-[var(--bg-card)] sm:px-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <img
                  alt="Logo da empresa"
                  src={LogoSvg}
                  className="h-20 w-auto sm:h-24"
                />
                <h2 className="mt-4 text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  Crie sua conta
                </h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Comece em apenas alguns passos
                </p>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--primary-100)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)]"
              >
                <span>{isDark ? 'Modo escuro' : 'Modo claro'}</span>
                <span
                  className="flex h-5 w-10 items-center rounded-full px-1"
                  style={{
                    backgroundColor: isDark
                      ? 'var(--secondary-100)'
                      : '#ffffff',
                  }}
                >
                  <span
                    className={`h-3 w-3 rounded-full bg-[var(--primary-100)] transition-transform ${
                      isDark ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </span>
              </button>
            </div>

            <div className="mb-6 flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--primary-50)] px-2 py-1 text-[var(--primary-100)]">
                  Passo {step} de 2
                </span>
                <span className="text-[var(--text-muted)]">
                  {step === 1 ? 'Dados de acesso' : 'Endereço'}
                </span>
              </div>
              <div className="flex gap-2">
                <span
                  className={`h-1.5 w-8 rounded-full ${
                    step === 1 ? 'bg-[var(--primary-100)]' : 'bg-[var(--border-color)]'
                  }`}
                />
                <span
                  className={`h-1.5 w-8 rounded-full ${
                    step === 2 ? 'bg-[var(--primary-100)]' : 'bg-[var(--border-color)]'
                  }`}
                />
              </div>
            </div>

            {submitError && (
              <div className="mb-4 rounded-md border border-[var(--danger)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--danger)]">
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="mb-4 rounded-md border border-[var(--success)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--success)]">
                {submitSuccess}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className={step === 1 ? 'space-y-6' : 'space-y-6 hidden'}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm/6 font-medium text-[var(--text-primary)]">
                      Nome
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(event) => {
                        const value = event.target.value;
                        setName(value);
                        setNameError(validateName(value));
                      }}
                      onBlur={() => setNameTouched(true)}
                      className={inputBase}
                      ref={nameRef}
                      aria-invalid={
                        nameError || (nameTouched && isEmpty(name)) ? true : false
                      }
                      aria-describedby={
                        nameError || (nameTouched && isEmpty(name))
                          ? 'name-error'
                          : undefined
                      }
                    />
                    {nameTouched && !nameError && isEmpty(name) && (
                      <p id="name-error" className={errorText}>
                        Informe seu nome
                      </p>
                    )}
                    {nameError && (
                      <p id="name-error" className={errorText}>
                        {nameError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm/6 font-medium text-[var(--text-primary)]">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(event) => handlePhoneChange(event.target.value)}
                      onBlur={() => setPhoneTouched(true)}
                      placeholder="(11) 99999-9999"
                      className={inputBase}
                      ref={phoneRef}
                      aria-invalid={
                        phoneTouched &&
                        (isEmpty(phone) || phone.trim().length < 14)
                          ? true
                          : false
                      }
                      aria-describedby={
                        phoneTouched &&
                        (isEmpty(phone) || phone.trim().length < 14)
                          ? 'phone-error'
                          : undefined
                      }
                    />
                    {phoneTouched && isEmpty(phone) && (
                      <p id="phone-error" className={errorText}>
                        Informe seu telefone
                      </p>
                    )}
                    {phoneTouched && !isEmpty(phone) && phone.trim().length < 14 && (
                      <p id="phone-error" className={errorText}>
                        Informe um telefone completo
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm/6 font-medium text-[var(--text-primary)]">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => {
                      const value = event.target.value;
                      setEmail(value);
                      setEmailError(validateEmail(value));
                    }}
                    placeholder="seuemail@exemplo.com"
                    className={inputBase}
                    ref={emailRef}
                    aria-invalid={emailError ? true : false}
                    aria-describedby={emailError ? 'email-error' : undefined}
                  />
                  {emailError && (
                    <p id="email-error" className={errorText}>
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm/6 font-medium text-[var(--text-primary)]">
                      Senha
                    </label>
                    <div className="mt-2 flex items-center rounded-md bg-[var(--bg-input)] ring-1 ring-[var(--border-color)] focus-within:ring-2 focus-within:ring-[var(--primary-100)]">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => {
                          const value = event.target.value;
                          setPassword(value);
                          setPasswordError(validatePassword(value));
                          if (!value) {
                            setPasswordStrength('');
                          } else if (value.length < 6) {
                            setPasswordStrength('fraca');
                          } else if (!strongPasswordPattern.test(value)) {
                            setPasswordStrength('media');
                          } else {
                            setPasswordStrength('forte');
                          }
                        }}
                        className={inputPasswordBase}
                        ref={passwordRef}
                        aria-invalid={passwordError ? true : false}
                        aria-describedby={
                          passwordError || passwordStrength ? 'password-help' : undefined
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="px-3 text-[var(--text-soft)] hover:text-[var(--text-primary)]"
                      >
                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordStrength && (
                      <p
                        id="password-help"
                        className="mt-1 text-xs text-[var(--text-soft)]"
                      >
                        Força da senha:{' '}
                        {passwordStrength === 'fraca'
                          ? 'Fraca'
                          : passwordStrength === 'media'
                          ? 'Média'
                          : 'Forte'}
                      </p>
                    )}
                    {passwordError && (
                      <p id="password-help" className={errorText}>
                        {passwordError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm/6 font-medium text-[var(--text-primary)]">
                      Confirmar senha
                    </label>
                    <div className="mt-2 flex items-center rounded-md bg-[var(--bg-input)] ring-1 ring-[var(--border-color)] focus-within:ring-2 focus-within:ring-[var(--primary-100)]">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className={inputPasswordBase}
                        ref={confirmPasswordRef}
                        aria-invalid={passwordMismatch ? true : false}
                        aria-describedby={passwordMismatch ? 'confirm-password-error' : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="px-3 text-[var(--text-soft)] hover:text-[var(--text-primary)]"
                      >
                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordMismatch && (
                      <p
                        id="confirm-password-error"
                        className="mt-1 text-xs text-[var(--danger)]"
                      >
                        As senhas não coincidem
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoToStep2}
                  className="flex w-full justify-center rounded-md bg-[var(--primary-100)] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[var(--primary-90)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-100)]"
                >
                  Seguinte
                </button>
              </div>

              <div className={step === 2 ? 'space-y-6' : 'space-y-6 hidden'}>
                <div>
                  <label className="block text-sm/6 font-medium text-[var(--text-primary)]">
                    Logradouro
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rua, avenida, etc."
                    value={street}
                    onChange={(event) => setStreet(event.target.value)}
                    onBlur={() => setStreetTouched(true)}
                    className={inputBase}
                    ref={streetRef}
                    aria-invalid={streetTouched && isEmpty(street) ? true : false}
                    aria-describedby={
                      streetTouched && isEmpty(street) ? 'street-error' : undefined
                    }
                  />
                  {streetTouched && isEmpty(street) && (
                    <p id="street-error" className={errorText}>
                      Informe o logradouro
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm/6 font-medium text-[var(--text-primary)]">
                    Complemento
                  </label>
                  <input
                    type="text"
                    placeholder="Apto, bloco, sala"
                    className={inputBase}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm/6 font-medium text-[var(--text-primary)]">
                      Número
                    </label>
                    <input
                      type="text"
                      required={!noNumber}
                      placeholder="123"
                      disabled={noNumber}
                      value={addressNumber}
                      onChange={(event) =>
                        setAddressNumber(event.target.value.replace(/\D/g, ''))
                      }
                      onBlur={() => setAddressNumberTouched(true)}
                      className={`${inputBase} ${inputBaseDisabledExtras}`}
                      ref={addressNumberRef}
                      aria-invalid={
                        !noNumber &&
                        addressNumberTouched &&
                        addressNumber.trim().length === 0
                          ? true
                          : false
                      }
                      aria-describedby={
                        !noNumber &&
                        addressNumberTouched &&
                        addressNumber.trim().length === 0
                          ? 'address-number-error'
                          : undefined
                      }
                    />
                    {!noNumber &&
                      addressNumberTouched &&
                      addressNumber.trim().length === 0 && (
                        <p id="address-number-error" className={errorText}>
                          Informe o número
                        </p>
                      )}
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={noNumber}
                        onChange={(event) => setNoNumber(event.target.checked)}
                        className="size-4 rounded border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--primary-100)] focus:ring-[var(--primary-100)]"
                      />
                      <span className="text-xs text-[var(--text-muted)]">
                        Meu endereço não possui número
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm/6 font-medium text-[var(--text-primary)]">
                      Bairro
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Seu bairro"
                      value={district}
                      onChange={(event) => setDistrict(event.target.value)}
                      onBlur={() => setDistrictTouched(true)}
                      className={inputBase}
                      ref={districtRef}
                      aria-invalid={
                        districtTouched &&
                        (isEmpty(district) || !isDistrictValid)
                          ? true
                          : false
                      }
                      aria-describedby={
                        districtTouched &&
                        (isEmpty(district) || !isDistrictValid)
                          ? 'district-error'
                          : undefined
                      }
                    />
                    {districtTouched && isEmpty(district) && (
                      <p id="district-error" className={errorText}>
                        Informe o bairro
                      </p>
                    )}
                    {districtTouched && !isEmpty(district) && !isDistrictValid && (
                      <p id="district-error" className={errorText}>
                        Use apenas letras no bairro
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm/6 font-medium text-[var(--text-primary)]">
                      Cidade
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sua cidade"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      onBlur={() => setCityTouched(true)}
                      className={inputBase}
                      ref={cityRef}
                      aria-invalid={
                        cityTouched && (isEmpty(city) || !isCityValid) ? true : false
                      }
                      aria-describedby={
                        cityTouched && (isEmpty(city) || !isCityValid)
                          ? 'city-error'
                          : undefined
                      }
                    />
                    {cityTouched && isEmpty(city) && (
                      <p id="city-error" className={errorText}>
                        Informe a cidade
                      </p>
                    )}
                    {cityTouched && !isEmpty(city) && !isCityValid && (
                      <p id="city-error" className={errorText}>
                        Use apenas letras na cidade
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm/6 font-medium text-[var(--text-primary)]">
                      Estado
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="UF"
                      value={addressState}
                      onChange={(event) =>
                        setAddressState(
                          event.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
                        )
                      }
                      onBlur={() => setAddressStateTouched(true)}
                      className={inputBase}
                      ref={addressStateRef}
                      aria-invalid={
                        addressStateTouched &&
                        (isEmpty(addressState) || addressState.trim().length < 2)
                          ? true
                          : false
                      }
                      aria-describedby={
                        addressStateTouched &&
                        (isEmpty(addressState) || addressState.trim().length < 2)
                          ? 'state-error'
                          : undefined
                      }
                    />
                    {addressStateTouched && isEmpty(addressState) && (
                      <p id="state-error" className={errorText}>
                        Informe o estado
                      </p>
                    )}
                    {addressStateTouched &&
                      addressState.trim().length > 0 &&
                      addressState.trim().length < 2 && (
                        <p id="state-error" className={errorText}>
                          Informe a UF com 2 letras
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(event) => {
                      setTermsAccepted(event.target.checked);
                      setTermsTouched(true);
                    }}
                    className="size-4 rounded border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--primary-100)] focus:ring-[var(--primary-100)]"
                    ref={termsRef}
                    aria-invalid={termsTouched && !termsAccepted ? true : false}
                    aria-describedby={
                      termsTouched && !termsAccepted ? 'terms-error' : undefined
                    }
                  />
                  <span className="text-sm text-[var(--text-muted)]">
                    Eu concordo com os{' '}
                    <a className="font-semibold text-[var(--primary-100)]">
                      Termos e Condições
                    </a>
                  </span>
                  {termsTouched && !termsAccepted && (
                    <p id="terms-error" className={errorText}>
                      Você precisa aceitar os Termos e Condições
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex w-full justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1.5 text-sm/6 font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-100)]"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={!isStep2Valid || isSubmitting}
                    className="flex w-full justify-center rounded-md bg-[var(--primary-100)] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[var(--primary-90)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-100)] disabled:bg-[var(--primary-50)] disabled:text-[var(--text-soft)] disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-10">
              <div className="flex items-center gap-x-6">
                <div className="w-full flex-1 border-t border-[var(--border-color)]" />
                <p className="text-sm/6 font-medium text-[var(--text-muted)]">
                  Ou cadastre-se com
                </p>
                <div className="w-full flex-1 border-t border-[var(--border-color)]" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  className="inline-flex justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: isDark
                      ? 'var(--secondary-100)'
                      : '#ffffff',
                    color: isDark ? '#ffffff' : 'var(--secondary-100)',
                    border: isDark
                      ? '1px solid transparent'
                      : '1px solid var(--border)',
                  }}
                >
                  Google
                </button>
                <button
                  className="inline-flex justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: isDark
                      ? 'var(--secondary-100)'
                      : '#ffffff',
                    color: isDark ? '#ffffff' : 'var(--secondary-100)',
                    border: isDark
                      ? '1px solid transparent'
                      : '1px solid var(--border)',
                  }}
                >
                  GitHub
                </button>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
            Já possui uma conta?{' '}
            <Link to="/" className="font-semibold text-[var(--primary-100)] hover:text-[var(--primary-90)]">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

