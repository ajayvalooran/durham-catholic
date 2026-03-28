<script>
function render(data) {
    const list = document.getElementById('parish-list');
    list.innerHTML = data.map(p => `
        <div class="card">
            <div class="city">${p.City || 'Durham'}</div>
            <div class="name">${p.Name || p.Parish || 'Unnamed Parish'}</div>
            
            <div class="time-row">
                <span class="label">Sunday Mass</span>
                <span class="val">${p.Sunday_Mass || p.Sunday || 'Contact Parish'}</span>
            </div>
            
            <div class="time-row">
                <span class="label">Good Friday</span>
                <span class="val">${p.Good_Friday || 'TBD'}</span>
            </div>

            <div class="easter-row">
                <div class="time-row" style="border:0; margin:0;">
                    <span class="label">Easter Sunday</span>
                    <span class="val" style="color:#d35400">${p.Easter_Sunday || 'TBD'}</span>
                </div>
            </div>

            <div class="actions">
                <a href="${p.Website || '#'}" target="_blank" class="btn btn-web">Bulletin</a>
                <a href="${p.Directions_Link || p.Directions || '#'}" target="_blank" class="btn btn-nav">Directions</a>
            </div>
        </div>
    `).join('');
}
  </script>
