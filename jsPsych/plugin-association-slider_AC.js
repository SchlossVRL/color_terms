var jsPsychAssociationSlider = (function (jspsych) {
  "use strict";

  const info = {
    name: "association-slider",

    parameters: {
      concept: {
        type: jspsych.ParameterType.STRING,
        default: undefined,
      },

      color_hex: {
        type: jspsych.ParameterType.STRING,
        default: undefined,
      },

      min: {
        type: jspsych.ParameterType.INT,
        default: -200,
      },

      max: {
        type: jspsych.ParameterType.INT,
        default: 200,
      },

      step: {
        type: jspsych.ParameterType.INT,
        default: 1,
      },

      slider_start: {
        type: jspsych.ParameterType.INT,
        default: 0,
      },

      slider_width: {
        type: jspsych.ParameterType.INT,
        default: 400,
      },

      left_label: {
        type: jspsych.ParameterType.STRING,
        default: "not at all",
      },

      right_label: {
        type: jspsych.ParameterType.STRING,
        default: "very much",
      },
    },

    data: {
      response: {
        type: jspsych.ParameterType.INT,
      },
    },
  };

  class AssociationSliderPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      // --------------------------------------------------
      // DISPLAY TRIAL
      // --------------------------------------------------

      display_element.innerHTML = `

                <div style="text-align:center; width:100%;">

                  
                    <div style="
                        font-size:24px;
                        font-weight:bold;
                        margin-bottom:25px;
                    ">
                        ${trial.concept}
                    </div>

                  
                    <div style="
                        width:100px;
                        height:100px;
                        background-color:${trial.color_hex};
                        margin:0 auto 45px auto;
                    ">
                    </div>

                  
                    <input
                        type="range"
                        id="association-slider"
                        min="${trial.min}"
                        max="${trial.max}"
                        step="${trial.step}"
                        value="${trial.slider_start}"
                        style="
                            width:${trial.slider_width}px;
                            max-width:85vw;
                            height:30px;
                            margin:0 auto;
                            display:block;
                            appearance:none;
                            -webkit-appearance:none;
                            background:transparent;
                            cursor:pointer;
                        "
                    >

                
                    <div style="
                        width:${trial.slider_width}px;
                        max-width:85vw;
                        margin:-17px auto 0 auto;
                        height:4px;
                        position:relative;
                        pointer-events:none;
                    ">

                 
                    <span style="
                        position:absolute;
                        left:0;
                        top:-12px;
                        height:30px;
                        width:1px;
                        background:black;
                    "></span>

               
                    <span style="
                        position:absolute;
                        left:50%;
                        top:-6px;
                        height:16px;
                        width:1px;
                        background:black;
                    "></span>

              
                    <span style="
                        position:absolute;
                        right:0;
                        top:-12px;
                        height:30px;
                        width:1px;
                        background:black;
                    "></span>

                </div>

             
                    <div style="
                        width:${trial.slider_width}px;
                        max-width:85vw;
                        margin:0 auto;
                        position:relative;
                        font-size:16px;
                        height:25px;
                    ">

                   
                    <span style="
                        position:absolute;
                        left:0;
                        top:15px;
                        transform:translateX(-50%);
                        white-space:nowrap;
                    ">
                        ${trial.left_label}
                    </span>

                    <span style="
                        position:absolute;
                        right:0;
                        top:15px;
                        transform:translateX(50%);
                        white-space:nowrap;
                    ">
                        ${trial.right_label}
                    </span>
                </div>

                </div>

                <style>

                    #association-slider::-webkit-slider-runnable-track {
                        height:1px;
                        background:black;
                    }

                    #association-slider::-moz-range-track {
                        height:1px;
                        background:black;
                    }

                    #association-slider::-webkit-slider-thumb {
                        appearance:none;
                        -webkit-appearance:none;
                        width:1px;
                        height:30px;
                        background:black;
                        border:none;
                        margin-top:-13px;
                    }

                    #association-slider::-moz-range-thumb {
                        width:1px;
                        height:30px;
                        background:black;
                        border:none;
                        border-radius:0;
                    }

                </style>

            `;

      const slider = display_element.querySelector("#association-slider");

      let locked = false;

      // --------------------------------------------------
      // UPDATE SLIDER BASED ON MOUSE POSITION
      // --------------------------------------------------

      function updateSlider(event) {
        if (locked) {
          return;
        }

        const rect = slider.getBoundingClientRect();

        let x = event.clientX - rect.left;

        x = Math.max(0, Math.min(x, rect.width));

        const percent = x / rect.width;

        const value =
          Number(trial.min) + percent * (Number(trial.max) - Number(trial.min));

        slider.value = Math.round(value / trial.step) * trial.step;

        slider.dispatchEvent(new Event("input", { bubbles: true }));
      }

      // --------------------------------------------------
      // MOUSE LISTENERS AND FINISH TRIAL
      // --------------------------------------------------

      const updateHandler = updateSlider;

      const finishHandler = (event) => {
        if (locked) {
          return;
        }

        updateSlider(event);

        locked = true;

        // Remove mouse and click listeners.
        document.removeEventListener("mousemove", updateHandler);
        document.removeEventListener("click", finishHandler);

        // Record response.

        const response = Number(slider.value);

        // Clear the screen.

        display_element.innerHTML = "";

        // Wait 500 ms before advancing to the next trial.

        setTimeout(() => {
          this.jsPsych.finishTrial({
            response: response,
          });
        }, 500);
      };

      // Track mouse movement across the document.
      document.addEventListener("mousemove", updateHandler);

      // Submit response on any click.
      document.addEventListener("click", finishHandler);
    }
  }

  AssociationSliderPlugin.info = info;

  return AssociationSliderPlugin;
})(jsPsychModule);
