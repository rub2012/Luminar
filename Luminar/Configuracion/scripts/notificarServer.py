import requests ,RPi.GPIO as GPIO, subprocess, time
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
pin = 18
GPIO.setup(pin, GPIO.IN)

def cambioEstado(channel):
        myip = '10.10.5.1'
        luzPrendida = 'true' if GPIO.input(pin) else 'false'
        url = "http://192.168.1.60:52656/Red/Send"
        params = 'mensaje={"ip":"'+myip+'","encendido":'+luzPrendida+',"activo":true}'
        requests.get(url, params=params)

GPIO.add_event_detect(pin, GPIO.BOTH, callback=cambioEstado)
while True:
        time.sleep(60)