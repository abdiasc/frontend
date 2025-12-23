<!-- src/components/AutomationIndustrial.vue -->
<template>
  <section class="automation">
    <div class="automation-container">
      <!-- Header -->
      <div class="automation-header">
        <h2 class="automation-title">Automatización Industrial</h2>
        <p class="automation-subtitle">Soluciones tecnológicas para optimizar procesos industriales</p>
      </div>

      <!-- Grid de Servicios -->
      <div class="services-grid">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-card"
          @mouseenter="hoveredService = service.id"
          @mouseleave="hoveredService = null"
        >
          <div class="service-icon">
            <div class="icon-bg" :style="{ background: service.gradient }"></div>
            <svg v-html="service.icon"></svg>
          </div>

          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-desc">{{ service.description }}</p>

          <div class="service-features">
            <span v-for="feature in service.features" :key="feature" class="feature-tag">
              {{ feature }}
            </span>
          </div>

          <button class="service-btn" @click="selectService(service)">
            Conocer más
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-number">150+</div>
          <p class="stat-label">Proyectos Implementados</p>
        </div>
        <div class="stat-item">
          <div class="stat-number">45%</div>
          <p class="stat-label">Reducción de Costos</p>
        </div>
        <div class="stat-item">
          <div class="stat-number">99.8%</div>
          <p class="stat-label">Disponibilidad del Sistema</p>
        </div>
        <div class="stat-item">
          <div class="stat-number">24/7</div>
          <p class="stat-label">Soporte Técnico</p>
        </div>
      </div>

      <!-- Proceso -->
      <div class="process-section">
        <h2 class="process-title">Nuestro Proceso</h2>
        <div class="process-steps">
          <div v-for="(step, index) in processSteps" :key="index" class="step">
            <div class="step-number">{{ index + 1 }}</div>
            <h4 class="step-title">{{ step.title }}</h4>
            <p class="step-desc">{{ step.description }}</p>
            <svg v-if="index < processSteps.length - 1" class="step-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedServiceData" class="modal-overlay" @click="selectedServiceData = null">
          <div class="modal-content" @click.stop>
            <button class="modal-close" @click="selectedServiceData = null">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="modal-body">
              <div class="modal-icon" :style="{ background: selectedServiceData.gradient }">
                <svg v-html="selectedServiceData.icon"></svg>
              </div>

              <div class="modal-info">
                <h3 class="modal-title">{{ selectedServiceData.title }}</h3>
                <p class="modal-description">{{ selectedServiceData.fullDescription }}</p>

                <div class="modal-benefits">
                  <h4>Beneficios</h4>
                  <ul>
                    <li v-for="benefit in selectedServiceData.benefits" :key="benefit">
                      {{ benefit }}
                    </li>
                  </ul>
                </div>

                <button class="modal-btn">
                  Solicitar Cotización
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const hoveredService = ref(null)
const selectedServiceData = ref(null)

const services = ref([
  {
    id: 1,
    title: 'Sistemas PLC y SCADA',
    description: 'Control y monitoreo de procesos industriales en tiempo real',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    icon: '<circle cx="12" cy="12" r="9" stroke="white" fill="none" stroke-width="2"/><path d="M12 7v10M7 12h10" stroke="white" stroke-width="2"/>',
    features: ['Control Automático', 'Monitoreo Real-time', 'Alertas Inteligentes'],
    fullDescription: 'Implementación de sistemas PLC (Programmable Logic Controller) y SCADA (Supervisory Control and Data Acquisition) para automatizar y monitorear procesos industriales complejos.',
    benefits: [
      'Reducción de errores humanos hasta el 99%',
      'Aumento de la producción en un 40%',
      'Menor consumo energético',
      'Datos precisos para análisis'
    ]
  },
  {
    id: 2,
    title: 'Robótica Industrial',
    description: 'Robots colaborativos para tareas repetitivas y peligrosas',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    icon: '<rect x="4" y="6" width="16" height="12" rx="2" stroke="white" fill="none" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="white"/><path d="M8 12h8" stroke="white" stroke-width="2"/>',
    features: ['Cobot Seguro', 'Precisión ±0.1mm', 'Fácil Programación'],
    fullDescription: 'Integración de robots colaborativos (cobots) que trabajan junto a los operarios en líneas de producción, realizando tareas de soldadura, ensamble y manipulación.',
    benefits: [
      'Seguridad mejorada en el trabajo',
      'Velocidad de producción 3x mayor',
      'Flexibilidad en cambios de producto',
      'Retorno de inversión en 18-24 meses'
    ]
  },
  {
    id: 3,
    title: 'IoT Industrial',
    description: 'Sensores inteligentes y conectividad para Internet de las Cosas',
    gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    icon: '<circle cx="12" cy="12" r="8" stroke="white" fill="none" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="white"/><circle cx="12" cy="6" r="1.5" fill="white"/><circle cx="18" cy="12" r="1.5" fill="white"/><circle cx="12" cy="18" r="1.5" fill="white"/><circle cx="6" cy="12" r="1.5" fill="white"/>',
    features: ['Sensores IoT', 'Cloud Analytics', 'Predictivo'],
    fullDescription: 'Red de sensores inteligentes conectados que recopilan datos en tiempo real, permitiendo análisis predictivo y mantenimiento preventivo.',
    benefits: [
      'Predicción de fallas 90 días antes',
      'Reduce paros no planeados',
      'Optimización de recursos',
      'Análisis de datos avanzado'
    ]
  },
  {
    id: 4,
    title: 'Integración de Sistemas',
    description: 'Conecta todos tus sistemas para una operación unificada',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    icon: '<rect x="3" y="5" width="7" height="6" rx="1" stroke="white" fill="none" stroke-width="2"/><rect x="14" y="5" width="7" height="6" rx="1" stroke="white" fill="none" stroke-width="2"/><rect x="3" y="13" width="7" height="6" rx="1" stroke="white" fill="none" stroke-width="2"/><rect x="14" y="13" width="7" height="6" rx="1" stroke="white" fill="none" stroke-width="2"/><path d="M10 8h4M8 16h8" stroke="white" stroke-width="1.5"/>',
    features: ['API REST', 'Integraciones MES', 'ERP Compatible'],
    fullDescription: 'Solución integral que conecta MES, ERP, SCADA y sistemas legacy para una operación completamente integrada y datos consistentes.',
    benefits: [
      'Eliminación de procesos manuales',
      'Información centralizada',
      'Trazabilidad completa',
      'Toma de decisiones más rápida'
    ]
  }
])

const processSteps = ref([
  {
    title: 'Diagnóstico',
    description: 'Análisis detallado de tus procesos actuales'
  },
  {
    title: 'Diseño',
    description: 'Solución personalizada para tus necesidades'
  },
  {
    title: 'Implementación',
    description: 'Instalación y configuración de sistemas'
  },
  {
    title: 'Soporte',
    description: 'Mantenimiento y optimización continua'
  }
])

const selectService = (service) => {
  selectedServiceData.value = service
}
</script>

<style scoped>
.automation {
  width: 97%;
  padding: 100px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f1f5f9;
}

.automation-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.automation-header {
  text-align: center;
  margin-bottom: 80px;
  animation: fadeInDown 0.6s ease-out;
}

.automation-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.automation-subtitle {
  font-size: 1.2rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 100px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.service-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px 24px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-12px);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 30px 60px rgba(99, 102, 241, 0.2);
}

.service-icon {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bg {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  opacity: 0.2;
  transition: opacity 0.3s ease;
}

.service-card:hover .icon-bg {
  opacity: 0.3;
}

.service-icon svg {
  position: relative;
  width: 48px;
  height: 48px;
  z-index: 1;
}

.service-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 12px;
}

.service-desc {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 20px;
  flex: 1;
}

.service-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  justify-content: center;
}

.feature-tag {
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.1);
  color: #a5b4fc;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.service-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.service-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
}

.service-btn svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.service-btn:hover svg {
  transform: translateX(4px);
}

/* Stats */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 100px;
  padding: 60px 40px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 1rem;
  color: #cbd5e1;
  margin: 0;
}

/* Process */
.process-section {
  margin-top: 100px;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.process-title {
  font-size: 2.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  position: relative;
}

.step {
  text-align: center;
  position: relative;
}

.step-number {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 900;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.step-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 8px;
}

.step-desc {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}

.step-arrow {
  position: absolute;
  right: -35px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  color: rgba(99, 102, 241, 0.4);
  display: none;
}

@media (min-width: 768px) {
  .step-arrow {
    display: block;
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 40px;
}

.modal-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.2;
}

.modal-icon svg {
  width: 60px;
  height: 60px;
  color: white;
}

.modal-title {
  font-size: 2rem;
  font-weight: 900;
  color: #f1f5f9;
  text-align: center;
  margin-bottom: 16px;
}

.modal-description {
  font-size: 1.05rem;
  color: #cbd5e1;
  line-height: 1.8;
  text-align: center;
  margin-bottom: 32px;
}

.modal-benefits {
  margin-bottom: 32px;
}

.modal-benefits h4 {
  font-size: 1.1rem;
  color: #f1f5f9;
  margin-bottom: 16px;
}

.modal-benefits ul {
  list-style: none;
  display: grid;
  gap: 12px;
}

.modal-benefits li {
  padding-left: 28px;
  position: relative;
  color: #cbd5e1;
  line-height: 1.6;
}

.modal-benefits li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
  font-size: 1.2rem;
}

.modal-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
}

.modal-btn svg {
  width: 18px;
  height: 18px;
}

/* Animaciones */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .automation {
    padding: 60px 16px;
  }

  .automation-header {
    margin-bottom: 50px;
  }

  .automation-title {
    font-size: 2rem;
  }

  .services-grid {
    margin-bottom: 60px;
  }

  .stats-section {
    margin-bottom: 60px;
    padding: 40px 24px;
  }

  .process-section {
    margin-top: 60px;
  }

  .step-arrow {
    display: none !important;
  }

  .modal-body {
    padding: 24px;
  }
}
</style>