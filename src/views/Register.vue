<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>Crear una cuenta</h2>
        <p class="subtitle">Únete a nuestra comunidad</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name" class="form-label">
            <span>Nombre completo</span>
            <span v-if="errors.name" class="error-icon">!</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Ej: Juan Pérez"
            required
            :class="{ 'input-error': errors.name }"
            @blur="validateField('name')"
          />
          <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
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
            @blur="validateField('email')"
            @input="validateEmail"
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
              placeholder="Mínimo 6 caracteres"
              required
              minlength="6"
              :class="{ 'input-error': errors.password }"
              @blur="validateField('password')"
              @input="validatePassword"
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
          <div class="password-strength" v-if="form.password">
            <div class="strength-bar" :class="passwordStrength"></div>
            <p class="strength-text">{{ strengthText }}</p>
          </div>
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">
            <span>Confirmar contraseña</span>
            <span v-if="errors.confirmPassword" class="error-icon">!</span>
          </label>
          <div class="password-input">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Repite tu contraseña"
              required
              :class="{ 'input-error': errors.confirmPassword }"
              @blur="validateField('confirmPassword')"
              @input="validatePasswordMatch"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <span class="eye-icon">{{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}</span>
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
        </div>

        <div class="terms-group">
          <input
            id="terms"
            v-model="acceptedTerms"
            type="checkbox"
            class="terms-checkbox"
          />
          <label for="terms" class="terms-label">
            Acepto los 
            <a href="#" class="terms-link" @click.prevent="showTerms = true">términos y condiciones</a>
            y la 
            <a href="#" class="terms-link" @click.prevent="showPrivacy = true">política de privacidad</a>
          </label>
        </div>
        <p v-if="errors.terms" class="error-message">{{ errors.terms }}</p>

        <button 
          type="submit" 
          class="submit-btn"
          :class="{ 'loading': isLoading }"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="!isLoading">Crear cuenta</span>
          <span v-else class="loading-spinner"></span>
        </button>

        <div class="login-link">
          ¿Ya tienes una cuenta? 
          <a href="#" class="link" @click.prevent="$emit('switch-to-login')">Inicia sesión</a>
        </div>
      </form>
    </div>

    <!-- Modal para términos -->
    <div v-if="showTerms" class="modal-overlay" @click.self="showTerms = false">
      <div class="modal">
        <h3>Términos y condiciones</h3>
        <div class="modal-content">
          <!-- Contenido de los términos -->
          <p>Texto de términos y condiciones aquí...</p>
        </div>
        <button class="modal-close" @click="showTerms = false">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: ''
})

const acceptedTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)

// Computed properties
const passwordStrength = computed(() => {
  if (!form.password) return 'empty'
  if (form.password.length < 6) return 'weak'
  if (form.password.length < 8) return 'medium'
  if (/[A-Z]/.test(form.password) && /[0-9]/.test(form.password) && /[^A-Za-z0-9]/.test(form.password)) {
    return 'strong'
  }
  return 'medium'
})

const strengthText = computed(() => {
  const texts = {
    empty: '',
    weak: 'Débil',
    medium: 'Media',
    strong: 'Fuerte'
  }
  return texts[passwordStrength.value]
})

const isFormValid = computed(() => {
  return (
    form.name &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    acceptedTerms.value &&
    Object.values(errors).every(error => !error) &&
    form.password === form.confirmPassword
  )
})

// Methods
const validateField = (field) => {
  errors[field] = ''
  
  switch(field) {
    case 'name':
      if (!form.name.trim()) {
        errors.name = 'El nombre es requerido'
      } else if (form.name.length < 2) {
        errors.name = 'El nombre debe tener al menos 2 caracteres'
      }
      break
      
    case 'email':
      if (!form.email) {
        errors.email = 'El correo es requerido'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Ingresa un correo válido'
      }
      break
      
    case 'password':
      if (!form.password) {
        errors.password = 'La contraseña es requerida'
      } else if (form.password.length < 6) {
        errors.password = 'Mínimo 6 caracteres'
      }
      break
      
    case 'confirmPassword':
      if (!form.confirmPassword) {
        errors.confirmPassword = 'Confirma tu contraseña'
      } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden'
      }
      break
  }
}

const validateEmail = () => {
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ingresa un correo válido'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  if (form.password && form.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres'
  } else {
    errors.password = ''
  }
  
  if (form.confirmPassword && form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  } else if (form.confirmPassword) {
    errors.confirmPassword = ''
  }
}

const validatePasswordMatch = () => {
  if (form.confirmPassword && form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  } else {
    errors.confirmPassword = ''
  }
}

const handleRegister = async () => {
  // Validar todos los campos
  Object.keys(form).forEach(field => validateField(field))
  
  if (!acceptedTerms.value) {
    errors.terms = 'Debes aceptar los términos y condiciones'
    return
  }
  
  if (Object.values(errors).some(error => error)) {
    return
  }
  
  isLoading.value = true
  
  try {
    // Simulación de API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Datos de registro:', {
      name: form.name,
      email: form.email,
      password: form.password
    })
    
    // Éxito
    alert('¡Cuenta creada exitosamente!')
    
    // Reset
    resetForm()
    
  } catch (error) {
    errors.form = 'Error al crear la cuenta. Intenta nuevamente.'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  acceptedTerms.value = false
  Object.keys(errors).forEach(key => errors[key] = '')
}

// Watchers
watch(acceptedTerms, (value) => {
  if (value) {
    errors.terms = ''
  }
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
}

.register-header {
  background: linear-gradient(135deg, #2c7be5 0%, #1a68d1 100%);
  color: white;
  padding: 32px 40px;
  text-align: center;
}

.register-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.register-form {
  padding: 40px;
}

.form-group {
  margin-bottom: 24px;
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

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.strength-bar.empty {
  background: #e2e8f0;
  width: 0%;
}

.strength-bar.weak {
  background: #e53e3e;
  width: 33%;
}

.strength-bar.medium {
  background: #d69e2e;
  width: 66%;
}

.strength-bar.strong {
  background: #38a169;
  width: 100%;
}

.strength-text {
  font-size: 11px;
  color: #666;
  margin: 0;
}

.terms-group {
  display: flex;
  align-items: flex-start;
  margin: 32px 0 16px;
  gap: 12px;
}

.terms-checkbox {
  width: 18px !important;
  height: 18px;
  margin-top: 2px;
}

.terms-label {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.4;
  flex: 1;
}

.terms-link {
  color: #2c7be5;
  text-decoration: none;
  font-weight: 600;
}

.terms-link:hover {
  text-decoration: underline;
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
  margin-top: 8px;
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-link {
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
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
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

.modal h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #2c7be5;
}

.modal-content {
  margin-bottom: 20px;
  color: #4a5568;
  line-height: 1.6;
}

.modal-close {
  background: #2c7be5;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.modal-close:hover {
  background: #1a68d1;
}
</style>