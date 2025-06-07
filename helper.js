function createAudioHTML(path) {
    return '<audio controls controlslist="nodownload" class="px-1"> <source src=' +
        path +
        ' type="audio/wav">Your browser does not support the audio element.</audio>';
  }
  const numPerPage = 2;
  
  async function getText(file, cell) {
    console.log('Fetching' + file);
    const myObject = await fetch(file);
    const myText = await myObject.text();
    cell.innerHTML = myText;
  }
  
  
  function generateTextToSongTable(tableId, n_samples, lang) {
    let table = document.getElementById(tableId);
  
    // Create table head;
    let thead = table.createTHead();
    let head_row = thead.insertRow();

    let cell = head_row.insertCell(0);
    cell.innerHTML = "Lyrics";
    cell.style.textAlign = "center";
    cell = head_row.insertCell(1);
    cell.innerHTML = "Reference";
    cell.style.textAlign = "center";
    cell = head_row.insertCell(2);
    cell.innerHTML = "Generated";
    cell.style.textAlign = "center";
  
    for (let i = 1; i <= n_samples; i++) {
      let row = table.insertRow(i);
      let cell = row.insertCell(0);
      getText('lyric/' + lang + '/' + i.toString()+'.txt', cell);
  
      cell = row.insertCell(1);
      cell.innerHTML = createAudioHTML('prompt/' + lang + '/' + i.toString() + '.mp3');

      cell = row.insertCell(2);
      cell.innerHTML = createAudioHTML('music/' + lang + '/' + i.toString() + '.flac');
    }
  }
  

  

  

  
  
  $(document).ready(function() {
  
    generateTextToSongTable('gen_cn',16, 'cn')
    generateTextToSongTable('gen_en',13, 'en')

    // generateTextToSongTable('gen_real',9, 'real')
  });
