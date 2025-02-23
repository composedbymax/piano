# Online Piano App
An interactive online piano application with customizable sound settings, a visualizer, a metronome, and real-time MIDI recording.

## Features
- **Playable Piano** – Click keys or use keyboard shortcuts to play notes.
- **Customizable Sound** – Adjust waveforms, detune, and polyphonic gain.
- **Reverb Effect** – Add realistic room ambiance with adjustable reverb.
- **Metronome** – Keep time with an integrated metronome.
- **Visualizer** – See real-time waveforms of your music.
- **Octave Shifting** – Change octaves dynamically.
- **MIDI Mapping** – Supports MIDI note representations.
- **Live Recording** – Capture and replay MIDI events.

## Technologies Used
- **JavaScript** – Core functionality
- **Web Audio API** – Sound synthesis and effects
- **Canvas API** – Audio visualization
- **HTML/CSS** – UI and styling

## How It Works
- **Play Notes** – Click on the keys or use keyboard shortcuts.
- **Enable Effects** – Use the slider to adjust effects.
- **Use the Metronome** – Toggle it on and set the tempo.
- **Record MIDI** – Play and capture your session.

## Controls

| Action            | Key / Interaction   |
|-------------------|---------------------|
| Play Note         | Click / Keyboard    |
| Octave Down       | Z                   |
| Octave Up         | X                   |
| Slide Down        | 1                   |
| Slide Up          | 2                   |
| Toggle Metronome  | Checkbox            |
| Adjust Tempo      | Number Input        |
| Adjust Volume     | Slider              |
| Adjust Tuning     | Slider              |
| Apply Reverb      | Toggle              |
| Apply Waveform    | Toggle              |

## Setup & Usage
1. Clone the repository:
    ```bash
    git clone https://github.com/composedbymax/piano.git
    ```
2. Open `index.html` in a browser when in piano repo.





```
   ▒  ░░▒  ░                                                                       
   ░                                        ░░░░  ░ ░                              
    ░                                 ░ ▒▒░░▒▒░▒▒▒░░░                              
     ▒░  ░                     ░▒  ▒▒░▒▓▓█▒░░░░▒█░▒░░▒▒░░░ ░                       
     ░                         ░░▒▓▒▒░▓▓▒ ░░░ ▓▒ ░░░▒▓▓▒▒░                         
                             ░░▒▒▓░░░░▓▒▒░░░ ░░▓█▒▒▓▒▓░░░░░ ░                      
                              ░▓░▓▓▒░░▒▓▓░░░ ░░░▒░▒▒▒▓░░    ░                      
                            ░▒░▓▒░▒▒▒▓▓▓▓░░       ▒ ░▓▒                            
                           ░░░░▒███▓▒▒▒▒░░░░ ░░░▒░░░▒▓▒ ░░                         
                         ░░ ░▒▓██▓░░░▒▒▓▓▒▓▓▓▓▓▓░░░░▒▒░▒░░░                        
                          ░░░▒██▒░▓▒█████████▓██▓▓▒▓▒▓▒░░░       ░░░▒              
                         ░░░ ░░▒▒▒▓██████████████▓▒▒░▒▒░░▒▓▒ ▒░░▒░░▒  ░░           
                         ▒▒▒░ ▒▒▒███████████████▓▓▒▒▒░░░ ░▓▓▓▒    ░░ ░   ░░░       
  ░                       ░▓▓░░▓████████████████▓▓▓░░░░░░    ░░░   ▒░ ░▒  ░        
                         ░░▒░▒░▒█████████████▓▓▒░░░░░░░░ ░░▓▓▓░▓                   
                           ░▓░▒░▓░▒▒▓▓▓███▓░░░░░░░░░░░░░░▓▓░░░                     
                      ░░▓▓▓▒▒▒░░░░░░░░░░▓▒░░░░▒▓█▓░░▒▓▒░░░░░                       
                      ░ ░░░▒▒▒▒▒░▒▒▒▓▓▓███▒▒▓█▓▓▓▓██▓▓░ ░░░░                       
                        ░░░░░▓░░░▒████████▒▒▓████▓▓▓▒▒░░░░░  ░░░░░                 
                          ░ ▒░░░░░█████▓██▓▒▒▒███▓▓▓▒░░░░░░░░░▒▒██░                
                             ░  ░░░▓▓██▓██▓▓▒░░█▓▓▓▒▒░░░▒░░▒▓██████░               
                               ░░▓█▓▓████▓▒░▒▓███▓▓▒░░░▓░▒█████████░░              
                              ░░█████▓█▒▓▒▒▓▒▒░░▒▒▓▒░░▒░███████████▓░              
                            ░░░███████▓▓▓▒░░░░▒▒▒▒▒░░▒▓█████████████░              
                           ░ ░█████████▓▓▓▓▓▒▓▓▓▓▒░░▒█████████████▒                
        ░                    ████████████▒▓▒▒▒▒▒░▒░░███▓▓▓▓▒░░░░ ░░                
                              ░░░░░░▒▓▒▓███░░░░░░░░█▓▓▒▒▓▓▒▒░░░░ ░                 
                              ░░░ ░░▓▓▓▒▒▒█▓▒░▒▒▒▒▓▓▒▒▓▓▒▒▒▒░░    ░                
        ▒                     ░░   ░▒▓▓▒▓▓▓▓▓▓▒▓▒▒▒▒▓▓▒▒▒▒░░   ░░                  
         ▓                    ░    ░▒▓▓▓▓▒▓▓▓▒▒▒░▒▓▒▒▒▒▒▒░░░░░░ ░                  
          ▒                        ░▓▓▓▓▓▓▓▓▓▒▒░▒▒▒▒▒▒▒▒░░░     ░                  
        ░▒░█                      ░▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒░░░░▓ ░                          
       ▒▓██▒▒░▒▒▓▓░              ░▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒░▒█░░                           
     ░▓█▒▓█▓▓▒▒▓░░░░             ▒▒▓▓▓▓▓▓▒▒▒▒▓▒▒▒▒░▒▓ ░ ░             ░            
     ░▓▓███▒▓█▒░░░░░             ░▒▒▓▓▓▓▓▒░▒▒▒▒▒░ █▒                               
     ▓██▒░▒▒▓▓░▓░▒░░             ░▒▓▒▓▓▓▒░░░░░   ▒░               ░                
 ░   ▒▒▒▓▓▒▓█▓▒░░▒▒░              ▒▒▒▒▒▓▒░░░▒▒ ░▒                                  
▒███▓▓▒▓█▓▒░░░░░▒░░░              ░▒▒▒▒▓▒░▒░░░▒░  ░            ░                   
░░▒▒▓░▒▓██▓░░░░░░░░                ▒▒▒▒▒▒░▒▒▒▒▒░              ░                    
░▒▒▒▒▒▒██▓▓░▒▓▓█▒                  ░▒▒▒▒▒▒░▒▒░░                                    
░▒▒▒▒▒▒▒▓▓▓▓▓██▒▒▓▒▓█░ ▒█████████▓░ ░▒░░▒▒▒░░░                                     
░▒▒▒▒▒▒▒▒▓▓▓▓▓▒▓▓▓▓██▓▒▓██▒▒▓██████▓▒      ░░                                      
░▒▒▒▒▒▒▒▒▒▒▒░░░░░░░▒▓▓████▓▓█▓▓▒▓▓▓░                                               
 ▒▓▒▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▒░░░▒▓▓▓▒▒░                                                 
░▓▓▓▓▒▒▓▓▒▒▓▒▒▒▒▒░░░░░░▒▒▓▓▓▓▓▒░░░                                                 
 ▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒░░░░░░░░▒▒▒░░░                                                   
 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░▒░                                                     
 ░░▒▒▒░▒▒▒▒▒▒░░▒▒▒░▒▒░░░░░░░░                                                      
 ░░░░░░░░░░░▒░▒▒▒▒▒▒▒▒▒▒▒░░▒░░░                                                    
 ░░░░░░░░▒░▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░                                                    
 ░░░░░░░░░░░░░▒░▒░▒▒▒░░░░░░▒░░░░                                                   
```