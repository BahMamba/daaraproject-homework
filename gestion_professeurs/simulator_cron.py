# simulateur_cron.py
import os
import time

while True:
    print(">>> Starting job: adding a professor...")
    os.system("python manage.py ajouter_professeur")
    print(">>> Pausing for 5 minutes...\n")
    time.sleep(300)