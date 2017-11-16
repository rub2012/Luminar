import requests ,RPi.GPIO as GPIO, subprocess, time
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.IN)

def cambioEstado(channel):
	myip = '10.10.5.1'
	luzPrendida = 'true' if GPIO.input(17) else 'false'
	url = "http://192.168.1.40:52656/Red/Send"
	params = 'mensaje={"ip":"'+myip+'","encendido":'+luzPrendida+',"activo":true}'
	requests.get(url, params=params)

GPIO.add_event_detect(17, GPIO.BOTH, callback=cambioEstado) 
while True:
	time.sleep(60)
