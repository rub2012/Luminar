import RPi.GPIO as GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)  # set board mode to Broadcom
pin = 17

GPIO.setup(pin, GPIO.OUT)  # set up pin  GPIO 17

GPIO.output(pin, 0)  # turn off pin 17
