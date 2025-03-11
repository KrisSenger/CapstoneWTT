from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class Imgtest(LiveServerTestCase):
    def test_img_exists_multiple_browsers(self):
            browsers = {
                "Chrome": webdriver.Chrome,
                "Edge": webdriver.Edge,
                }
            for browser_name, browser_driver in browsers.items():
                with self.subTest(browser=browser_name):
                    driver = browser_driver()
                    try:
                        driver.get("http://localhost:5173/")

                        logo_element = WebDriverWait(driver, 10).until(
                            EC.presence_of_element_located((By.XPATH, "//img[@alt='Logo']"))
                            )

                        assert logo_element.get_attribute("alt") == "Logo"
                    finally:
                        driver.quit()

class LoginInputsTest(LiveServerTestCase):
    def test_login_inputs_exist_multiple_browsers(self):
        browsers = {
            "Chrome": webdriver.Chrome,
            "Edge": webdriver.Edge,
            }
        for browser_name, browser_driver in browsers.items():
            with self.subTest(browser=browser_name):
                driver = browser_driver()
                try:
                    driver.get("http://localhost:5173/")

                    username_input = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.ID, "username"))
                        )

                    password_input = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.ID, "password"))
                        )
            
                    self.assertIsNotNone(username_input)
                    self.assertIsNotNone(password_input)
                finally:
                    driver.quit()

class LoginFormTest(LiveServerTestCase):
        def test_login_form_multiple_browsers(self):
            browsers = {
                "Chrome": webdriver.Chrome,
                "Edge": webdriver.Edge,
                }
            for browser_name, browser_driver in browsers.items():
                with self.subTest(browser=browser_name):
                    driver = browser_driver()
                    try:
                        driver.get("http://localhost:5173/")
                    
                        username_input = driver.find_element(By.ID, "username")
                        password_input = driver.find_element(By.ID, "password")
                        username_input.send_keys("tcrow")
                        password_input.send_keys("password1")
                    
                        submit_button = driver.find_element(By.XPATH, "//button[@type='submit']")
                        submit_button.click()

                        WebDriverWait(driver, 20).until(
                        EC.text_to_be_present_in_element((By.XPATH, "(//h1)[2]"), "Taylor")
                        )
                        assert "Taylor" in driver.page_source
            
                    finally:
                        driver.quit()

