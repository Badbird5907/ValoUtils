plugins {
    id("java")
    id("io.freefair.lombok") version "8.1.0"
    id("com.github.johnrengelman.shadow") version "8.1.1"
}

group = "dev.badbird"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.squareup.okhttp3:okhttp:5.0.0-alpha.11")
    implementation("com.google.code.gson:gson:2.10.1")
    implementation("com.formdev:flatlaf:3.1.1")
    implementation("com.formdev:flatlaf-intellij-themes:3.1.1")
    implementation("li.flor:native-j-file-chooser:1.6.4")

    testImplementation(platform("org.junit:junit-bom:5.9.1"))
    testImplementation("org.junit.jupiter:junit-jupiter")
}

tasks.test {
    useJUnitPlatform()
}

tasks.shadowJar {
    archiveClassifier.set("")
    archiveVersion.set("")

    manifest {
        attributes["Main-Class"] = "dev.badbird.valoutils.Main"
    }
}
tasks.jar {
    dependsOn(tasks.shadowJar)
}
