/**
 * Business Hours Service
 * Muestra el estado actual del negocio (Abierto/Cerrado) según el horario de atención.
 * Horario: 6:30 PM - 11:00 PM todos los días
 */

document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('hero-status');
    if (!statusElement) return;

    const OPEN_HOUR = 18;    // 6:30 PM
    const OPEN_MINUTE = 30;
    const CLOSE_HOUR = 23;   // 11:00 PM
    const CLOSE_MINUTE = 0;

    function updateBusinessStatus() {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const totalCurrentMinutes = currentHours * 60 + currentMinutes;

        const openTime = OPEN_HOUR * 60 + OPEN_MINUTE;
        const closeTime = CLOSE_HOUR * 60 + CLOSE_MINUTE;

        const isOpen = totalCurrentMinutes >= openTime && totalCurrentMinutes < closeTime;

        if (isOpen) {
            statusElement.innerHTML = `<p class="hero__status--green">🟢 Abierto</p><span class="mid-line">|</span><p class="hero__schedule"> Hasta las 11:00 PM</p>`;
        } else {
            statusElement.innerHTML = `<p class="hero__status--red">🔴 Cerrado</p><span class="mid-line">|</span><p class="hero__schedule"> Hasta las 6:30 PM</p>`;
        }
    }

    // Actualizar inmediatamente al cargar
    updateBusinessStatus();

    // Actualizar cada minuto
    setInterval(updateBusinessStatus, 60000);
});
