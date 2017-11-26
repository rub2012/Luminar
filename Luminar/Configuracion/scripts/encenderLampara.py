import RPi.GPIO as GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)  # set board mode to Broadcom
pin = 17

GPIO.setup(pin, GPIO.OUT)  # set up pin  GPIO 17

GPIO.output(pin, 1)  # turn on pin 17