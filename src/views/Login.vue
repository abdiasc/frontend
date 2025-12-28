<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Bienvenido de nuevo</h2>
        <p class="subtitle">Inicia sesión en tu cuenta</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Notificación de éxito (si viene del registro) -->
        <div v-if="successMessage" class="success-message">
          <span class="success-icon">✓</span>
          {{ successMessage }}
        </div>

        <div class="form-group">
          <label for="email" class="form-label">
            <span>Correo electrónico</span>
            <span v-if="errors.email" class="error-icon">!</span>
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="ejemplo@correo.com"
            required
            :class="{ 'input-error': errors.email }"
            @blur="validateEmail"
            @input="clearError('email')"
            autocomplete="email"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <span>Contraseña</span>
            <span v-if="errors.password" class="error-icon">!</span>
          </label>
          <div class="password-input">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Ingresa tu contraseña"
              required
              :class="{ 'input-error': errors.password }"
              @blur="validatePassword"
              @input="clearError('password')"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <span class="eye-icon">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</span>
            </button>
          </div>
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>

        <div class="form-options">
          <div class="remember-me">
            <input
              id="remember"
              v-model="rememberMe"
              type="checkbox"
              class="remember-checkbox"
            />
            <label for="remember" class="remember-label">Recordarme</label>
          </div>
          
          <a href="#" class="forgot-password" @click.prevent="showForgotPassword = true">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <!-- Error general del formulario -->
        <div v-if="errors.form" class="form-error">
          <span class="error-icon">!</span>
          {{ errors.form }}
        </div>

        <button 
          type="submit" 
          class="submit-btn"
          :class="{ 'loading': isLoading }"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="!isLoading">Iniciar sesión</span>
          <span v-else class="loading-spinner"></span>
        </button>

        <!-- Separador social -->
        <div class="separator">
          <span>O continúa con</span>
        </div>

        <!-- Botones sociales -->
        <div class="social-login">
          <button type="button" class="social-btn google" @click="loginWithGoogle">
            <span class="social-icon">G</span>
            Google
          </button>
          <button type="button" class="social-btn github" @click="loginWithGithub">
            <span class="social-icon">Git</span>
            GitHub
          </button>
        </div>

        <div class="register-link">
          ¿No tienes una cuenta? 
          <a href="#" class="link" @click.prevent="$emit('switch-to-register')">Regístrate</a>
        </div>
      </form>
    </div>

    <!-- Modal de recuperación de contraseña -->
    <div v-if="showForgotPassword" class="modal-overlay" @click.self="showForgotPassword = false">
      <div class="modal">
        <h3>Recuperar contraseña</h3>
        <div class="modal-content">
          <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
          <div class="form-group">
            <label for="reset-email" class="form-label">Correo electrónico</label>
            <input
              id="reset-email"
              v-model="resetEmail"
              type="email"
              placeholder="ejemplo@correo.com"
              :class="{ 'input-error': resetError }"
            />
            <p v-if="resetError" class="error-message">{{ resetError }}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="modal-btn secondary" @click="showForgotPassword = false">
            Cancelar
          </button>
          <button class="modal-btn primary" @click="handlePasswordReset" :disabled="isResetting">
            <span v-if="!isResetting">Enviar enlace</span>
            <span v-else class="loading-spinner small"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de verificación de email -->
    <div v-if="showVerificationModal" class="modal-overlay" @click.self="showVerificationModal = false">
      <div class="modal">
        <div class="verification-icon">📧</div>
        <h3>Verifica tu correo</h3>
        <div class="modal-content">
          <p>Hemos enviado un enlace de verificación a tu correo electrónico.</p>
          <p class="email-sent">{{ verificationEmail }}</p>
          <p>Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.</p>
        </div>
        <div class="modal-actions">
          <button class="modal-btn primary" @click="showVerificationModal = false">
            Entendido
          </button>
          <button class="modal-btn link" @click="resendVerification">
            Reenviar correo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'

// Props para manejar flujos como registro exitoso
const props = defineProps({
  registeredEmail: {
    type: String,
    default: ''
  },
  showVerification: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['switch-to-register', 'login-success'])

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: '',
  form: ''
})

const successMessage = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const showForgotPassword = ref(false)
const showVerificationModal = ref(false)
const resetEmail = ref('')
const resetError = ref('')
const isResetting = ref(false)

// Computed properties
const isFormValid = computed(() => {
  return form.email && form.password && Object.values(errors).every(error => !error)
})

// Métodos
const validateEmail = () => {
  if (!form.email.trim()) {
    errors.email = 'El correo es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ingresa un correo válido'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'La contraseña es requerida'
  } else {
    errors.password = ''
  }
}

const clearError = (field) => {
  errors[field] = ''
  errors.form = ''
}

const handleLogin = async () => {
  // Validar campos
  validateEmail()
  validatePassword()
  
  if (errors.email || errors.password) {
    return
  }
  
  isLoading.value = true
  errors.form = ''
  
  try {
    // Simulación de API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Aquí normalmente verificarías con tu backend
    console.log('Login attempt:', {
      email: form.email,
      password: form.password,
      rememberMe: rememberMe.value
    })
    
    // Simular diferentes casos de error
    const mockResponses = [
      { success: true, message: 'Login exitoso' },
      { success: false, error: 'Credenciales incorrectas' },
      { success: false, error: 'Cuenta no verificada', needsVerification: true }
    ]
    
    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    
    if (response.success) {
      // Login exitoso
      successMessage.value = '¡Bienvenido de vuelta!'
      
      // Guardar en localStorage si "Recordarme" está activado
      if (rememberMe.value) {
        localStorage.setItem('rememberedEmail', form.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }
      
      // Emitir evento de éxito
      emit('login-success', { email: form.email })
      
      // Redirigir (simulado)
      setTimeout(() => {
        alert('Redirigiendo al dashboard...')
        // En una app real: router.push('/dashboard')
      }, 1000)
      
    } else {
      // Manejar errores
      if (response.needsVerification) {
        showVerificationModal.value = true
        verificationEmail.value = form.email
      } else {
        errors.form = response.error
      }
    }
    
  } catch (error) {
    errors.form = 'Error de conexión. Intenta nuevamente.'
  } finally {
    isLoading.value = false
  }
}

const loginWithGoogle = () => {
  console.log('Login con Google')
  // Implementar OAuth con Google
  alert('Login con Google (simulado)')
}

const loginWithGithub = () => {
  console.log('Login con GitHub')
  // Implementar OAuth con GitHub
  alert('Login con GitHub (simulado)')
}

const handlePasswordReset = async () => {
  if (!resetEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.value)) {
    resetError.value = 'Ingresa un correo válido'
    return
  }
  
  isResetting.value = true
  
  try {
    // Simular envío de email
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert(`Se ha enviado un enlace de recuperación a ${resetEmail.value}`)
    showForgotPassword.value = false
    resetEmail.value = ''
    resetError.value = ''
    
  } catch (error) {
    resetError.value = 'Error al enviar el correo'
  } finally {
    isResetting.value = false
  }
}

const resendVerification = () => {
  console.log('Reenviando verificación a:', verificationEmail.value)
  alert('Correo de verificación reenviado')
}

// Cargar email recordado al montar
onMounted(() => {
  const rememberedEmail = localStorage.getItem('rememberedEmail')
  if (rememberedEmail) {
    form.email = rememberedEmail
    rememberMe.value = true
  }
  
  // Mostrar mensaje de registro exitoso si viene de registro
  if (props.registeredEmail) {
    form.email = props.registeredEmail
    successMessage.value = '¡Cuenta creada exitosamente! Por favor, inicia sesión.'
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  }
  
  // Mostrar modal de verificación si es necesario
  if (props.showVerification) {
    showVerificationModal.value = true
    verificationEmail.value = form.email
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, #2c7be5 0%, #1a68d1 100%);
  color: white;
  padding: 32px 40px;
  text-align: center;
}

.login-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.login-form {
  padding: 40px;
}

.success-message {
  background: #c6f6d5;
  border: 1px solid #9ae6b4;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
  color: #22543d;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slideDown 0.3s ease;
}

.success-icon {
  background: #38a169;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.error-icon {
  background: #e53e3e;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #2c7be5;
  box-shadow: 0 0 0 3px rgba(44, 123, 229, 0.1);
}

.input-error {
  border-color: #e53e3e !important;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 0;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
}

.toggle-password:hover {
  color: #2c7be5;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remember-checkbox {
  width: 18px !important;
  height: 18px;
  margin: 0;
}

.remember-label {
  font-size: 14px;
  color: #4a5568;
  cursor: pointer;
}

.forgot-password {
  font-size: 14px;
  color: #2c7be5;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.form-error {
  background: #fed7d7;
  border: 1px solid #fc8181;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  color: #c53030;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #2c7be5 0%, #1a68d1 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44, 123, 229, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn.loading {
  cursor: wait;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: #a0aec0;
  font-size: 14px;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.separator span {
  padding: 0 15px;
}

.social-login {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.social-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.social-btn.google:hover {
  border-color: #dd4b39;
  background: #fce8e6;
}

.social-btn.github:hover {
  border-color: #333;
  background: #f6f8fa;
}

.social-icon {
  font-weight: bold;
  font-size: 14px;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #666;
}

.link {
  color: #2c7be5;
  font-weight: 600;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.3s ease;
}

.verification-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
}

.email-sent {
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 12px 0;
  color: #2c7be5;
  font-weight: 500;
  text-align: center;
}

.modal h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #2c7be5;
  text-align: center;
}

.modal-content {
  margin-bottom: 24px;
  color: #4a5568;
  line-height: 1.6;
}

.modal-content p {
  margin-bottom: 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn.primary {
  background: #2c7be5;
  color: white;
}

.modal-btn.primary:hover {
  background: #1a68d1;
}

.modal-btn.secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.modal-btn.secondary:hover {
  background: #cbd5e0;
}

.modal-btn.link {
  background: none;
  color: #2c7be5;
}

.modal-btn.link:hover {
  background: #ebf8ff;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>