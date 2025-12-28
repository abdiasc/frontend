<template>
    <div class="reportes-admin">
        <!-- Encabezado del panel -->
        <header class="admin-header">
            <div class="header-content">
                <h1><i class="fas fa-chart-bar"></i> Panel de Reportes y Análisis</h1>
                <p class="welcome-text">Analiza el rendimiento del sistema, visualiza métricas clave y genera reportes detallados.</p>
            </div>
            
            <!-- Acciones rápidas -->
            <div class="header-actions">
                <button class="btn btn-primary" @click="generateReport">
                    <i class="fas fa-file-export"></i> Generar Reporte
                </button>
                <button class="btn btn-secondary" @click="scheduleReport">
                    <i class="fas fa-calendar-alt"></i> Programar Reporte
                </button>
                <button class="btn btn-secondary" @click="exportDashboard">
                    <i class="fas fa-download"></i> Exportar Datos
                </button>
            </div>
        </header>

        <!-- Filtros de fecha y métricas -->
        <div class="filters-section">
            <div class="filters-container">
                <!-- Selector de período -->
                <div class="filter-group">
                    <label><i class="fas fa-calendar"></i> Período</label>
                    <div class="period-selector">
                        <button 
                            v-for="period in periods" 
                            :key="period.value"
                            class="period-btn"
                            :class="{ active: selectedPeriod === period.value }"
                            @click="selectPeriod(period.value)"
                        >
                            {{ period.label }}
                        </button>
                        <button 
                            class="period-btn custom"
                            :class="{ active: selectedPeriod === 'custom' }"
                            @click="showCustomRange = true"
                        >
                            Personalizado
                        </button>
                    </div>
                </div>
                
                <!-- Selector de métricas -->
                <div class="filter-group">
                    <label><i class="fas fa-chart-line"></i> Métricas</label>
                    <div class="metrics-selector">
                        <select v-model="selectedMetrics" multiple>
                            <option value="visitas">Visitas</option>
                            <option value="usuarios">Usuarios</option>
                            <option value="proyectos">Proyectos</option>
                            <option value="ingresos">Ingresos</option>
                            <option value="conversion">Tasa de Conversión</option>
                            <option value="retencion">Retención</option>
                        </select>
                    </div>
                </div>
                
                <!-- Filtros adicionales -->
                <div class="filter-group">
                    <label><i class="fas fa-filter"></i> Filtros Avanzados</label>
                    <div class="advanced-filters">
                        <select v-model="filterSource">
                            <option value="">Todas las fuentes</option>
                            <option value="web">Web</option>
                            <option value="mobile">Móvil</option>
                            <option value="api">API</option>
                        </select>
                        <select v-model="filterStatus">
                            <option value="">Todos los estados</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Rango personalizado -->
            <div v-if="showCustomRange" class="custom-range">
                <div class="date-inputs">
                    <div class="date-input">
                        <label>Desde</label>
                        <input type="date" v-model="customStartDate">
                    </div>
                    <div class="date-input">
                        <label>Hasta</label>
                        <input type="date" v-model="customEndDate">
                    </div>
                </div>
                <button class="btn btn-sm" @click="applyCustomRange">
                    Aplicar
                </button>
            </div>
        </div>

        <!-- Dashboard de métricas clave -->
        <div class="kpi-dashboard">
            <div class="kpi-card">
                <div class="kpi-header">
                    <div class="kpi-icon total">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="kpi-trend positive">
                        <i class="fas fa-arrow-up"></i> 12.5%
                    </div>
                </div>
                <div class="kpi-content">
                    <h3>Visitas Totales</h3>
                    <p class="kpi-value">{{ formatNumber(kpis.totalVisits) }}</p>
                    <p class="kpi-period">vs período anterior</p>
                </div>
            </div>
            
            <div class="kpi-card">
                <div class="kpi-header">
                    <div class="kpi-icon users">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="kpi-trend positive">
                        <i class="fas fa-arrow-up"></i> 8.3%
                    </div>
                </div>
                <div class="kpi-content">
                    <h3>Usuarios Únicos</h3>
                    <p class="kpi-value">{{ formatNumber(kpis.uniqueUsers) }}</p>
                    <p class="kpi-period">vs período anterior</p>
                </div>
            </div>
            
            <div class="kpi-card">
                <div class="kpi-header">
                    <div class="kpi-icon revenue">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="kpi-trend positive">
                        <i class="fas fa-arrow-up"></i> 15.2%
                    </div>
                </div>
                <div class="kpi-content">
                    <h3>Ingresos Totales</h3>
                    <p class="kpi-value">${{ formatCurrency(kpis.totalRevenue) }}</p>
                    <p class="kpi-period">vs período anterior</p>
                </div>
            </div>
            
            <div class="kpi-card">
                <div class="kpi-header">
                    <div class="kpi-icon conversion">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="kpi-trend negative">
                        <i class="fas fa-arrow-down"></i> 2.1%
                    </div>
                </div>
                <div class="kpi-content">
                    <h3>Tasa de Conversión</h3>
                    <p class="kpi-value">{{ kpis.conversionRate }}%</p>
                    <p class="kpi-period">vs período anterior</p>
                </div>
            </div>
        </div>

        <!-- Gráficos y visualizaciones -->
        <div class="charts-section">
            <div class="main-chart">
                <div class="chart-header">
                    <h3><i class="fas fa-chart-line"></i> Tendencia de Visitas</h3>
                    <div class="chart-actions">
                        <button class="chart-btn" @click="changeChartType('line')">
                            <i class="fas fa-chart-line"></i>
                        </button>
                        <button class="chart-btn" @click="changeChartType('bar')">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="chart-btn" @click="changeChartType('area')">
                            <i class="fas fa-chart-area"></i>
                        </button>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas ref="visitsChart"></canvas>
                </div>
            </div>
            
            <div class="secondary-charts">
                <div class="chart-card">
                    <div class="chart-header">
                        <h3><i class="fas fa-user-friends"></i> Distribución de Usuarios</h3>
                    </div>
                    <div class="chart-container">
                        <canvas ref="usersChart"></canvas>
                    </div>
                </div>
                
                <div class="chart-card">
                    <div class="chart-header">
                        <h3><i class="fas fa-project-diagram"></i> Proyectos por Estado</h3>
                    </div>
                    <div class="chart-container">
                        <canvas ref="projectsChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tablas de datos -->
        <div class="tables-section">
            <div class="table-card">
                <div class="table-header">
                    <h3><i class="fas fa-table"></i> Reporte Detallado de Visitas</h3>
                    <button class="btn btn-sm" @click="exportTable('visits')">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Visitas</th>
                                <th>Usuarios Únicos</th>
                                <th>Páginas/Vista</th>
                                <th>Duración Promedio</th>
                                <th>Tasa de Rebote</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="visit in visitsData" :key="visit.date">
                                <td>{{ visit.date }}</td>
                                <td>{{ formatNumber(visit.visits) }}</td>
                                <td>{{ formatNumber(visit.uniqueUsers) }}</td>
                                <td>{{ visit.pagesPerVisit.toFixed(1) }}</td>
                                <td>{{ formatDuration(visit.avgDuration) }}</td>
                                <td>
                                    <span :class="getBounceRateClass(visit.bounceRate)">
                                        {{ visit.bounceRate }}%
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="table-card">
                <div class="table-header">
                    <h3><i class="fas fa-money-bill-wave"></i> Reporte de Ingresos</h3>
                    <button class="btn btn-sm" @click="exportTable('revenue')">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Proyecto</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Método de Pago</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="revenue in revenueData" :key="revenue.id">
                                <td>
                                    <div class="client-cell">
                                        <div class="client-avatar" :style="{ backgroundColor: getAvatarColor(revenue.client) }">
                                            {{ getInitials(revenue.client) }}
                                        </div>
                                        <span>{{ revenue.client }}</span>
                                    </div>
                                </td>
                                <td>{{ revenue.project }}</td>
                                <td>{{ revenue.date }}</td>
                                <td class="text-right">${{ formatCurrency(revenue.amount) }}</td>
                                <td>
                                    <span class="status-badge" :class="revenue.status">
                                        {{ revenue.status }}
                                    </span>
                                </td>
                                <td>
                                    <span class="payment-method">
                                        <i :class="getPaymentIcon(revenue.paymentMethod)"></i>
                                        {{ revenue.paymentMethod }}
                                    </span>
                                </td>
                                <td>
                                    <button class="table-action" @click="viewInvoice(revenue.id)">
                                        <i class="fas fa-receipt"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Reportes predefinidos -->
        <div class="reports-section">
            <div class="section-header">
                <h2><i class="fas fa-file-alt"></i> Reportes Predefinidos</h2>
                <button class="btn btn-primary" @click="createCustomReport">
                    <i class="fas fa-plus"></i> Crear Reporte Personalizado
                </button>
            </div>
            
            <div class="reports-grid">
                <div class="report-card">
                    <div class="report-icon">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                    <div class="report-content">
                        <h3>Análisis de Audiencia</h3>
                        <p>Demografía, intereses y comportamiento de los usuarios.</p>
                        <div class="report-meta">
                            <span><i class="fas fa-clock"></i> Generado: Hoy</span>
                            <span><i class="fas fa-file-pdf"></i> PDF</span>
                        </div>
                    </div>
                    <div class="report-actions">
                        <button class="report-btn" @click="runReport('audience')">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="report-btn" @click="scheduleReport('audience')">
                            <i class="fas fa-calendar-alt"></i>
                        </button>
                        <button class="report-btn" @click="exportReport('audience')">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
                
                <div class="report-card">
                    <div class="report-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="report-content">
                        <h3>Reporte de Ventas</h3>
                        <p>Tendencias de ventas, productos más vendidos y análisis de clientes.</p>
                        <div class="report-meta">
                            <span><i class="fas fa-clock"></i> Generado: Ayer</span>
                            <span><i class="fas fa-file-excel"></i> Excel</span>
                        </div>
                    </div>
                    <div class="report-actions">
                        <button class="report-btn" @click="runReport('sales')">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="report-btn" @click="scheduleReport('sales')">
                            <i class="fas fa-calendar-alt"></i>
                        </button>
                        <button class="report-btn" @click="exportReport('sales')">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
                
                <div class="report-card">
                    <div class="report-icon">
                        <i class="fas fa-server"></i>
                    </div>
                    <div class="report-content">
                        <h3>Rendimiento del Sistema</h3>
                        <p>Métricas de uso, tiempos de respuesta y análisis de errores.</p>
                        <div class="report-meta">
                            <span><i class="fas fa-clock"></i> Generado: Esta semana</span>
                            <span><i class="fas fa-file-pdf"></i> PDF</span>
                        </div>
                    </div>
                    <div class="report-actions">
                        <button class="report-btn" @click="runReport('performance')">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="report-btn" @click="scheduleReport('performance')">
                            <i class="fas fa-calendar-alt"></i>
                        </button>
                        <button class="report-btn" @click="exportReport('performance')">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
                
                <div class="report-card">
                    <div class="report-icon">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div class="report-content">
                        <h3>Reporte de Usuarios</h3>
                        <p>Registros, actividad, retención y análisis de comportamiento.</p>
                        <div class="report-meta">
                            <span><i class="fas fa-clock"></i> Generado: Este mes</span>
                            <span><i class="fas fa-file-excel"></i> Excel</span>
                        </div>
                    </div>
                    <div class="report-actions">
                        <button class="report-btn" @click="runReport('users')">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="report-btn" @click="scheduleReport('users')">
                            <i class="fas fa-calendar-alt"></i>
                        </button>
                        <button class="report-btn" @click="exportReport('users')">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Panel de análisis avanzado -->
        <div class="advanced-analytics">
            <div class="section-header">
                <h2><i class="fas fa-brain"></i> Análisis Predictivo</h2>
                <button class="btn btn-secondary" @click="refreshPredictions">
                    <i class="fas fa-sync-alt"></i> Actualizar Predicciones
                </button>
            </div>
            
            <div class="predictions-grid">
                <div class="prediction-card">
                    <div class="prediction-header">
                        <h3><i class="fas fa-chart-line"></i> Proyección de Ingresos</h3>
                        <div class="confidence">94% confianza</div>
                    </div>
                    <div class="prediction-chart">
                        <canvas ref="revenuePredictionChart"></canvas>
                    </div>
                    <div class="prediction-stats">
                        <div class="stat">
                            <span>Próximo mes</span>
                            <strong>${{ formatCurrency(predictions.nextMonthRevenue) }}</strong>
                        </div>
                        <div class="stat">
                            <span>Crecimiento esperado</span>
                            <strong class="positive">+{{ predictions.revenueGrowth }}%</strong>
                        </div>
                    </div>
                </div>
                
                <div class="prediction-card">
                    <div class="prediction-header">
                        <h3><i class="fas fa-users"></i> Predicción de Usuarios</h3>
                        <div class="confidence">89% confianza</div>
                    </div>
                    <div class="prediction-chart">
                        <canvas ref="usersPredictionChart"></canvas>
                    </div>
                    <div class="prediction-stats">
                        <div class="stat">
                            <span>Nuevos usuarios (30 días)</span>
                            <strong>{{ formatNumber(predictions.newUsers) }}</strong>
                        </div>
                        <div class="stat">
                            <span>Tasa de retención esperada</span>
                            <strong>{{ predictions.retentionRate }}%</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de programación de reportes -->
        <div v-if="showScheduleModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-calendar-alt"></i> Programar Reporte</h3>
                    <button class="close-modal" @click="showScheduleModal = false">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Nombre del Reporte</label>
                        <input type="text" v-model="scheduleName" placeholder="Reporte Semanal de Ventas">
                    </div>
                    <div class="form-group">
                        <label>Frecuencia</label>
                        <select v-model="scheduleFrequency">
                            <option value="daily">Diario</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensual</option>
                            <option value="quarterly">Trimestral</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Destinatarios</label>
                        <input type="text" v-model="scheduleRecipients" placeholder="email@ejemplo.com, otro@ejemplo.com">
                    </div>
                    <div class="form-group">
                        <label>Formato</label>
                        <div class="format-selector">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="scheduleFormats.pdf" value="pdf">
                                <span>PDF</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="scheduleFormats.excel" value="excel">
                                <span>Excel</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="scheduleFormats.email" value="email">
                                <span>Email</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="showScheduleModal = false">Cancelar</button>
                    <button class="btn btn-primary" @click="confirmSchedule">Programar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
    name: 'ReportesAdmin',
    data() {
        return {
            selectedPeriod: 'month',
            periods: [
                { label: 'Hoy', value: 'today' },
                { label: 'Ayer', value: 'yesterday' },
                { label: 'Últimos 7 días', value: 'week' },
                { label: 'Últimos 30 días', value: 'month' },
                { label: 'Últimos 90 días', value: 'quarter' },
                { label: 'Este año', value: 'year' }
            ],
            selectedMetrics: ['visitas', 'usuarios', 'ingresos'],
            filterSource: '',
            filterStatus: '',
            showCustomRange: false,
            customStartDate: '',
            customEndDate: '',
            
            // KPIs
            kpis: {
                totalVisits: 15420,
                uniqueUsers: 8245,
                totalRevenue: 45280,
                conversionRate: 3.2
            },
            
            // Datos de visitas
            visitsData: [
                { date: '2024-01-15', visits: 1245, uniqueUsers: 825, pagesPerVisit: 3.2, avgDuration: 245, bounceRate: 42 },
                { date: '2024-01-16', visits: 1320, uniqueUsers: 890, pagesPerVisit: 3.5, avgDuration: 267, bounceRate: 38 },
                { date: '2024-01-17', visits: 1425, uniqueUsers: 945, pagesPerVisit: 3.8, avgDuration: 289, bounceRate: 35 },
                { date: '2024-01-18', visits: 1380, uniqueUsers: 915, pagesPerVisit: 3.6, avgDuration: 256, bounceRate: 41 },
                { date: '2024-01-19', visits: 1520, uniqueUsers: 1010, pagesPerVisit: 4.1, avgDuration: 312, bounceRate: 32 }
            ],
            
            // Datos de ingresos
            revenueData: [
                { id: 1, client: 'María González', project: 'E-commerce Moderno', date: '2024-01-15', amount: 12500, status: 'pagado', paymentMethod: 'tarjeta' },
                { id: 2, client: 'TechCorp Solutions', project: 'Dashboard Analytics', date: '2024-01-16', amount: 8500, status: 'pendiente', paymentMethod: 'transferencia' },
                { id: 3, client: 'Carlos Rodríguez', project: 'App de Tareas', date: '2024-01-17', amount: 4500, status: 'pagado', paymentMethod: 'paypal' },
                { id: 4, client: 'InnovateDev', project: 'API Rest', date: '2024-01-18', amount: 7200, status: 'pagado', paymentMethod: 'tarjeta' },
                { id: 5, client: 'Laura Martínez', project: 'Portal Gobierno', date: '2024-01-19', amount: 18000, status: 'pendiente', paymentMethod: 'transferencia' }
            ],
            
            // Predicciones
            predictions: {
                nextMonthRevenue: 52150,
                revenueGrowth: 15.2,
                newUsers: 1250,
                retentionRate: 78.5
            },
            
            // Modal de programación
            showScheduleModal: false,
            scheduleName: '',
            scheduleFrequency: 'weekly',
            scheduleRecipients: '',
            scheduleFormats: {
                pdf: true,
                excel: true,
                email: false
            },
            
            // Referencias a los gráficos
            visitsChart: null,
            usersChart: null,
            projectsChart: null,
            revenuePredictionChart: null,
            usersPredictionChart: null
        }
    },
    mounted() {
        // Inicializar gráficos
        this.initCharts();
        
        // Establecer fechas por defecto para el rango personalizado
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        this.customStartDate = thirtyDaysAgo.toISOString().split('T')[0];
        this.customEndDate = today.toISOString().split('T')[0];
    },
    methods: {
        selectPeriod(period) {
            this.selectedPeriod = period;
            this.showCustomRange = false;
            this.refreshData();
        },
        
        applyCustomRange() {
            if (this.customStartDate && this.customEndDate) {
                this.selectedPeriod = 'custom';
                this.refreshData();
            }
        },
        
        refreshData() {
            // En una implementación real, aquí se haría una llamada a la API
            console.log('Refrescando datos con período:', this.selectedPeriod);
            
            // Actualizar KPIs (simulado)
            this.kpis = {
                totalVisits: Math.floor(Math.random() * 5000) + 12000,
                uniqueUsers: Math.floor(Math.random() * 3000) + 7000,
                totalRevenue: Math.floor(Math.random() * 20000) + 35000,
                conversionRate: (Math.random() * 2 + 2.5).toFixed(1)
            };
            
            // Actualizar gráficos
            this.updateCharts();
        },
        
        initCharts() {
            // Gráfico de visitas
            const visitsCtx = this.$refs.visitsChart.getContext('2d');
            this.visitsChart = new Chart(visitsCtx, {
                type: 'line',
                data: {
                    labels: ['Ene 15', 'Ene 16', 'Ene 17', 'Ene 18', 'Ene 19'],
                    datasets: [{
                        label: 'Visitas',
                        data: [1245, 1320, 1425, 1380, 1520],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' }
                        },
                        x: {
                            grid: { display: false }
                        }
                    }
                }
            });
            
            // Gráfico de distribución de usuarios
            const usersCtx = this.$refs.usersChart.getContext('2d');
            this.usersChart = new Chart(usersCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Nuevos', 'Recurrentes', 'Inactivos'],
                    datasets: [{
                        data: [45, 35, 20],
                        backgroundColor: [
                            '#48bb78',
                            '#4299e1',
                            '#e53e3e'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
            
            // Gráfico de proyectos
            const projectsCtx = this.$refs.projectsChart.getContext('2d');
            this.projectsChart = new Chart(projectsCtx, {
                type: 'bar',
                data: {
                    labels: ['Completados', 'En Progreso', 'Pendientes', 'Cancelados'],
                    datasets: [{
                        data: [12, 8, 5, 2],
                        backgroundColor: [
                            '#48bb78',
                            '#4299e1',
                            '#ed8936',
                            '#e53e3e'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' }
                        }
                    }
                }
            });
            
            // Gráfico de predicción de ingresos
            const revenuePredictionCtx = this.$refs.revenuePredictionChart.getContext('2d');
            this.revenuePredictionChart = new Chart(revenuePredictionCtx, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Real',
                        data: [12500, 13800, 15200, 16800, null, null],
                        borderColor: '#48bb78',
                        borderWidth: 2,
                        fill: false
                    }, {
                        label: 'Predicción',
                        data: [null, null, null, 16800, 18500, 20300],
                        borderColor: '#667eea',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: value => '$' + this.formatCurrency(value)
                            }
                        }
                    }
                }
            });
            
            // Gráfico de predicción de usuarios
            const usersPredictionCtx = this.$refs.usersPredictionChart.getContext('2d');
            this.usersPredictionChart = new Chart(usersPredictionCtx, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Real',
                        data: [825, 890, 945, 1010, null, null],
                        borderColor: '#48bb78',
                        borderWidth: 2,
                        fill: false
                    }, {
                        label: 'Predicción',
                        data: [null, null, null, 1010, 1150, 1280],
                        borderColor: '#ed8936',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        },
        
        updateCharts() {
            // En una implementación real, actualizaría los datos de los gráficos
            // Por ahora, solo simulamos con datos aleatorios
            
            const randomData = Array(5).fill().map(() => Math.floor(Math.random() * 300) + 1200);
            
            if (this.visitsChart) {
                this.visitsChart.data.datasets[0].data = randomData;
                this.visitsChart.update();
            }
        },
        
        changeChartType(type) {
            if (this.visitsChart) {
                this.visitsChart.config.type = type;
                this.visitsChart.update();
            }
        },
        
        formatNumber(num) {
            return num.toLocaleString('es-ES');
        },
        
        formatCurrency(amount) {
            return amount.toLocaleString('es-ES', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        },
        
        formatDuration(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        },
        
        getBounceRateClass(rate) {
            if (rate < 30) return 'low-bounce';
            if (rate < 50) return 'medium-bounce';
            return 'high-bounce';
        },
        
        getAvatarColor(name) {
            const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
            const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return colors[index % colors.length];
        },
        
        getInitials(name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        },
        
        getPaymentIcon(method) {
            const icons = {
                'tarjeta': 'fas fa-credit-card',
                'transferencia': 'fas fa-university',
                'paypal': 'fab fa-paypal'
            };
            return icons[method] || 'fas fa-money-bill-wave';
        },
        
        generateReport() {
            alert('Generando reporte personalizado...');
            // Implementar generación de reporte
        },
        
        scheduleReport() {
            this.showScheduleModal = true;
        },
        
        confirmSchedule() {
            alert(`Reporte "${this.scheduleName}" programado para enviarse ${this.scheduleFrequency}mente`);
            this.showScheduleModal = false;
            this.resetScheduleForm();
        },
        
        resetScheduleForm() {
            this.scheduleName = '';
            this.scheduleFrequency = 'weekly';
            this.scheduleRecipients = '';
            this.scheduleFormats = {
                pdf: true,
                excel: true,
                email: false
            };
        },
        
        exportDashboard() {
            alert('Exportando dashboard completo...');
            // Implementar exportación del dashboard
        },
        
        exportTable(table) {
            alert(`Exportando tabla de ${table}...`);
            // Implementar exportación de tabla específica
        },
        
        runReport(reportType) {
            alert(`Ejecutando reporte: ${reportType}`);
            // Implementar ejecución de reporte
        },
        
        exportReport(reportType) {
            alert(`Exportando reporte: ${reportType}`);
            // Implementar exportación de reporte
        },
        
        createCustomReport() {
            alert('Creando reporte personalizado...');
            // Implementar creación de reporte personalizado
        },
        
        refreshPredictions() {
            alert('Actualizando predicciones...');
            // Implementar actualización de predicciones
        },
        
        viewInvoice(id) {
            alert(`Viendo factura ID: ${id}`);
            // Implementar vista de factura
        }
    }
}
</script>

<style scoped>
.reportes-admin {
    padding: 2rem;
    max-width: 1600px;
    margin: 0 auto;
    background-color: #f8fafc;
    min-height: 100vh;
}

/* Encabezado */
.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1.5rem;
}

.header-content h1 {
    color: #1a202c;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.welcome-text {
    color: #718096;
    font-size: 1.1rem;
    max-width: 600px;
}

.header-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

/* Botones */
.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-secondary {
    background-color: #e2e8f0;
    color: #4a5568;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

/* Filtros */
.filters-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filters-container {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
}

.filter-group {
    flex: 1;
    min-width: 200px;
}

.filter-group label {
    display: block;
    margin-bottom: 0.75rem;
    color: #4a5568;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.period-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.period-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 6px;
    color: #4a5568;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.3s ease;
}

.period-btn:hover {
    border-color: #667eea;
    color: #667eea;
}

.period-btn.active {
    background: #667eea;
    border-color: #667eea;
    color: white;
}

.period-btn.custom {
    background: #f7fafc;
    font-weight: 500;
}

.metrics-selector select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    color: #4a5568;
    height: 120px;
}

.advanced-filters {
    display: flex;
    gap: 0.5rem;
}

.advanced-filters select {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    color: #4a5568;
}

.custom-range {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
}

.date-inputs {
    display: flex;
    gap: 1rem;
    flex: 1;
}

.date-input {
    flex: 1;
}

.date-input label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-size: 0.875rem;
}

.date-input input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.875rem;
}

/* KPI Dashboard */
.kpi-dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.kpi-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
}

.kpi-card:hover {
    transform: translateY(-4px);
}

.kpi-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.kpi-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
}

.kpi-icon.total {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.kpi-icon.users {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.kpi-icon.revenue {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.kpi-icon.conversion {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.kpi-trend {
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.kpi-trend.positive {
    color: #48bb78;
}

.kpi-trend.negative {
    color: #e53e3e;
}

.kpi-content h3 {
    font-size: 0.875rem;
    color: #718096;
    margin-bottom: 0.5rem;
}

.kpi-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0.5rem 0;
}

.kpi-period {
    font-size: 0.75rem;
    color: #a0aec0;
    margin: 0;
}

/* Gráficos */
.charts-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.main-chart, .chart-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.chart-header h3 {
    color: #1a202c;
    font-size: 1.125rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
}

.chart-actions {
    display: flex;
    gap: 0.5rem;
}

.chart-btn {
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    color: #718096;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.chart-btn:hover {
    background: #667eea;
    border-color: #667eea;
    color: white;
}

.chart-container {
    height: 300px;
    position: relative;
}

.secondary-charts {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Tablas */
.tables-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.table-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
}

.table-header h3 {
    color: #1a202c;
    font-size: 1.125rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
}

.table-container {
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th {
    background-color: #f7fafc;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #4a5568;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
}

.data-table td {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    color: #4a5568;
    white-space: nowrap;
}

.data-table tbody tr:hover {
    background-color: #f8fafc;
}

.text-right {
    text-align: right;
}

.low-bounce {
    color: #48bb78;
    font-weight: 600;
}

.medium-bounce {
    color: #ed8936;
    font-weight: 600;
}

.high-bounce {
    color: #e53e3e;
    font-weight: 600;
}

.client-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.client-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.875rem;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
}

.status-badge.pagado {
    background-color: #c6f6d5;
    color: #22543d;
}

.status-badge.pendiente {
    background-color: #feebc8;
    color: #744210;
}

.payment-method {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4a5568;
}

.table-action {
    background: none;
    border: none;
    color: #718096;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.table-action:hover {
    background-color: #f7fafc;
    color: #667eea;
}

/* Reportes predefinidos */
.reports-section {
    margin-bottom: 2rem;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.section-header h2 {
    color: #1a202c;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
}

.reports-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.report-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.3s ease;
}

.report-card:hover {
    transform: translateY(-4px);
}

.report-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    flex-shrink: 0;
}

.report-content {
    flex: 1;
}

.report-content h3 {
    color: #1a202c;
    font-size: 1rem;
    margin: 0 0 0.5rem;
}

.report-content p {
    color: #718096;
    font-size: 0.875rem;
    margin: 0 0 0.75rem;
    line-height: 1.4;
}

.report-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: #a0aec0;
}

.report-meta span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.report-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.report-btn {
    background: none;
    border: 1px solid #e2e8f0;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    color: #718096;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.report-btn:hover {
    background: #667eea;
    border-color: #667eea;
    color: white;
}

/* Análisis predictivo */
.advanced-analytics {
    margin-bottom: 2rem;
}

.predictions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
}

.prediction-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.prediction-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.prediction-header h3 {
    color: #1a202c;
    font-size: 1.125rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
}

.confidence {
    padding: 0.25rem 0.75rem;
    background-color: #c6f6d5;
    color: #22543d;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
}

.prediction-chart {
    height: 200px;
    margin-bottom: 1.5rem;
}

.prediction-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
}

.stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.stat span {
    color: #718096;
    font-size: 0.75rem;
}

.stat strong {
    color: #1a202c;
    font-size: 1.125rem;
}

.stat strong.positive {
    color: #48bb78;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
    margin: 0;
    color: #1a202c;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.close-modal {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #a0aec0;
    cursor: pointer;
    line-height: 1;
}

.modal-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-weight: 500;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #4a5568;
}

.format-selector {
    display: flex;
    gap: 1rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

/* Responsive */
@media (max-width: 1200px) {
    .charts-section {
        grid-template-columns: 1fr;
    }
    
    .predictions-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .reportes-admin {
        padding: 1rem;
    }
    
    .admin-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .header-actions {
        width: 100%;
        justify-content: center;
    }
    
    .filters-container {
        flex-direction: column;
        gap: 1rem;
    }
    
    .filter-group {
        min-width: 100%;
    }
    
    .custom-range {
        flex-direction: column;
        align-items: stretch;
    }
    
    .date-inputs {
        flex-direction: column;
    }
    
    .kpi-dashboard {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
    
    .table-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .kpi-dashboard {
        grid-template-columns: 1fr;
    }
    
    .reports-grid {
        grid-template-columns: 1fr;
    }
    
    .header-content h1 {
        font-size: 1.5rem;
    }
}
</style>