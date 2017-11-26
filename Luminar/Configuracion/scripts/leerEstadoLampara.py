import RPi.GPIO as GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)  # set board mode to Broadcom
pin = 18

GPIO.setup(pin, GPIO.IN)  # set up pin  GPIO 18

print(GPIO.input(pin), end='') # Leer pin 18