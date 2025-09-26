<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Davomatni Boshqarish</h3>
        <button type="button" class="close-button" @click="$emit('close')">
          &times;
        </button>
      </div>

      <div class="modal-body">
        <p v-if="lease">
          Ijara:
          <strong
            >{{ lease.owner.fullName }} -
            {{ lease.store?.storeNumber || lease.stall?.stallNumber }}</strong
          >
        </p>

        <div class="calendar-controls">
          <button @click="changeMonth(-1)">&lt;</button>
          <span>{{ monthName }} {{ year }}</span>
          <button @click="changeMonth(1)">&gt;</button>
        </div>

        <div class="calendar-grid">
          <div class="day-header" v-for="day in weekDays" :key="day">
            {{ day }}
          </div>
          <div
            v-for="day in calendarDays"
            :key="day.dateString"
            :class="['day-cell', day.class]"
            @click="toggleAttendance(day)"
          >
            <span class="day-number">{{ day.dayOfMonth }}</span>
          </div>
        </div>

        <div class="legend">
          <div><span class="legend-box present"></span> Kelgan</div>
          <div><span class="legend-box absent"></span> Kelmagan</div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('close')">
          Yopish
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { attendanceService } from '@/services/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'AttendanceModal',
  props: {
    lease: { type: Object, required: true }
  },
  emits: ['close', 'updated'],
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1, // 1-12
      absences: new Set(), // A Set for efficient lookup of absent dates
      calendarDays: [],
      weekDays: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
    }
  },
  computed: {
    monthName() {
      return new Date(this.year, this.month - 1).toLocaleString('default', {
        month: 'long'
      })
    }
  },
  watch: {
    // Re-fetch data whenever the component is shown or the month changes
    lease: {
      handler() {
        this.fetchAbsences()
      },
      immediate: true
    },
    month() {
      this.fetchAbsences()
    },
    year() {
      this.fetchAbsences()
    }
  },
  methods: {
    async fetchAbsences() {
      if (!this.lease) return
      try {
        const response = await attendanceService.getAbsences(
          this.lease.id,
          this.year,
          this.month
        )
        // Store absence dates in YYYY-MM-DD format for easy lookup
        this.absences = new Set(response.data.map(a => a.date.split('T')[0]))
        this.generateCalendar()
      } catch (error) {
        this.toast.error("Davomat ma'lumotlarini yuklab bo'lmadi.")
      }
    },
    generateCalendar() {
      const days = []
      const date = new Date(this.year, this.month - 1, 1)
      const firstDayOfWeek = (date.getDay() + 6) % 7 // 0=Monday, 6=Sunday
      const daysInMonth = new Date(this.year, this.month, 0).getDate()

      // Add blank cells for the days before the 1st of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({ dayOfMonth: '', class: 'blank' })
      }

      // Add cells for each day of the month
      for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(this.year, this.month - 1, i)
        const dateString = dayDate.toISOString().split('T')[0]
        const isAbsent = this.absences.has(dateString)

        days.push({
          dayOfMonth: i,
          dateString,
          isAbsent,
          class: isAbsent ? 'absent' : 'present'
        })
      }
      this.calendarDays = days
    },
    async toggleAttendance(day) {
      if (!day.dateString) return // Ignore clicks on blank cells

      const newStatusIsPresent = day.isAbsent // If they were absent, the new status is present

      try {
        await attendanceService.setStatus(
          this.lease.id,
          day.dateString,
          newStatusIsPresent
        )
        this.toast.success('Davomat muvaffaqiyatli yangilandi!')
        this.$emit('updated') // Tell the parent view to refresh its data

        // Refresh the calendar immediately for a better UX
        this.fetchAbsences()
      } catch (error) {
        this.toast.error('Davomatni yangilashda xatolik yuz berdi.')
      }
    },
    changeMonth(direction) {
      let newMonth = this.month + direction
      let newYear = this.year
      if (newMonth > 12) {
        newMonth = 1
        newYear++
      }
      if (newMonth < 1) {
        newMonth = 12
        newYear--
      }
      this.month = newMonth
      this.year = newYear
    }
  }
}
</script>

<style scoped>
/* Main modal structure (reused from your other modals for consistency) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  animation: slide-in 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

/* Calendar Specific Styles */
.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  user-select: none;
}

.calendar-controls span {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.calendar-controls button {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.calendar-controls button:hover {
  background-color: #e0e0e0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-header {
  font-weight: 600;
  font-size: 0.8rem;
  color: #999;
  text-align: center;
  padding-bottom: 0.5rem;
}

.day-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease-out;
  border: 2px solid transparent;
}

.day-cell.blank {
  cursor: default;
}

.day-cell:not(.blank):hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.day-cell.present {
  background-color: #eaf7f0;
  color: #27ae60;
}

.day-cell.absent {
  background-color: #fdecea;
  color: #c0392b;
  font-weight: bold;
  border-color: #f1b0a7;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #555;
}

.legend-box {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
  border-radius: 3px;
  vertical-align: middle;
}

.legend .present {
  background-color: #eaf7f0;
}
.legend .absent {
  background-color: #fdecea;
}

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
